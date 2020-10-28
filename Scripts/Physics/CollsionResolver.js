import MeshData from "../Components/MeshData.js";
import RigidBody from "../Components/RigidBody.js"
import Vector3 from "../Math/Vector3.js";
import Time from "../Time.js";
import PhysicsContact from "./PhysicsContact.js"

export default class CollisionResolver{
    static _instance;


    constructor(scene){
        this.GameObjects =scene.SceneObjects;
        CollisionResolver._instance = this;

        this.RigidBodies =[];
        for(let i =0 ;i< this.GameObjects.length; i++){
            if(this.GameObjects[i].GetComponent("RigidBody")){
                this.RigidBodies.push(this.GameObjects[i].GetComponent("RigidBody"));
            }
        }

        this.Collsions =[];
    
    }

    static get Instance(){
        if(CollisionResolver._instance ==null){
            CollisionResolver._instance = CollisionResolver.createIntance();
        }
        return CollisionResolver._instance;
    }

    clear(){
        this.GameObjects =[];
        this.RigidBodies =[];
        this.Collsions =[];
    }
    
    update(){
        this.registerCollisions();
        //console.log("WTF")
        this.resolveCollisions();
        this.Collsions.length =0;
    }

    // step(GameObject){
    //     this.registerCollisionWithObject(GameObject);
    //     this.resolveCollisions();
    //     this.Collsions.length =0;
    // }

    // registerCollisionWithObject(GameObject){
    //     for( let i=0; i< this.GameObjects.length; i++){
            
    //         //if(this.GameObjects[i] === GameObject) continue;

    //         console.log("tester message");
    //         let collision = this.CheckCollision(GameObject, this.GameObjects[i]);
    //         console.log(collision);
    //         if(collision){
    //             this.Collsions.push(collision);
    //         }
    //     }

       
        
    // }

    registerCollisions(){
        for( let i=0; i< this.GameObjects.length-1; i++){
            for(let j = i+1;j< this.GameObjects.length; j++){
                let collision = this.CheckCollision(this.GameObjects[i], this.GameObjects[j]);
                if(collision){
                    this.Collsions.push(collision);
                }
            }
        }
    }

    resolveCollisions(){
        for( let i=0; i< this.Collsions.length; i++){
           this.Collsions[i].Resolve(Time.DeltaTime);
        }
    }

    CheckCollision(gameObject1, gameObject2){
        let meshData1 = gameObject1.GetComponent("meshData");
        let meshData2 = gameObject2.GetComponent("meshData");

        if(!meshData1 || !meshData2){
            console.log("one of the scene gameObjects has no mesh");
            return;
        }
                
        let vertices1 =  this.GetGlobalMeshData(meshData1);
        let normals1 =this.ConverVector3Array(meshData1._shape.VertexNormals);
        //console.log(normals1,vertices1);


        let vertices2 = this.GetGlobalMeshData(meshData2);
        let normals2 =this.ConverVector3Array(meshData2._shape.VertexNormals);


        let boxExtents1 = this.GetBoxExtents(vertices1);
        let boxExtents2 = this.GetBoxExtents(vertices2);

        let overlap = (boxExtents1.XAxis.minX < boxExtents2.XAxis.maxX && boxExtents1.XAxis.maxX >= boxExtents2.XAxis.minX)&&
                    (boxExtents1.YAxis.minY < boxExtents2.YAxis.maxY && boxExtents1.YAxis.maxY >= boxExtents2.YAxis.minY)&&                                                               
                    (boxExtents1.ZAxis.minZ < boxExtents2.ZAxis.maxZ && boxExtents1.ZAxis.maxZ >= boxExtents2.ZAxis.minZ);

        if(!overlap){
            
            return;
        }

        //console.log("Collision", gameObject1, gameObject2);

        
      

      
        let rigidBody1 =gameObject1.GetComponent("RigidBody");
        let rigidBody2;

        if(!rigidBody1){
            rigidBody1 =gameObject2.GetComponent("RigidBody");
        }
        else{
            rigidBody2 = gameObject2.GetComponent("RigidBody");
        }


        if(!rigidBody1){
            return;
        }



        let biggestCollision = { 
            collisionNormal: new Vector3(0,1,0),
            dotProduct:0,
        }
        
        //Get CollisionNormal
        for( let i=0; i< vertices1.length; i++){
            if(rigidBody1.Velocity.dot(normals1[i])>=0){
                continue;
            }

            for(let j=0; j<vertices2.length;j++){
                if(rigidBody1.Velocity.dot(normals2[j])>=0){
                    continue
                }

                let dotProduct =vertices1[i].subtractby(vertices2[j]).dot(normals2[j]);
                if(dotProduct>0){
                    if(dotProduct>biggestCollision.dotProduct){
                        biggestCollision.dotProduct = dotProduct;
                        biggestCollision.collisionNormal = normals2[j]
                    }
                }

            }
        }

        console.log(biggestCollision.collisionNormal);


        let physicsContact = new PhysicsContact(rigidBody1,rigidBody2);

        //console.log(physicsContact);
        //console.log(rigidBody1, rigidBody2);
        physicsContact.CollisionNormal = biggestCollision.collisionNormal;    
        physicsContact.penetration =-biggestCollision.dotProduct;
        return physicsContact;
    }

    GetGlobalMeshData(meshData){
        if(!meshData instanceof MeshData){
            console.error("Parameter should be of type MeshData")
            return;
        }

        let vertices = meshData._shape.VertexPositions;
        let vector3Array = [];

        //get a list of values into an aray of Vector3
        for(let i=0; i< vertices.length/3; i++){
            let startIndex = i*3;

            let x = vertices[startIndex];
            let y = vertices[startIndex+1];
            let z = vertices[startIndex+2];

            vector3Array.push(new Vector3(x,y,z));
        }
        let localScale = meshData.owner.transform._scale; 

        //Get local position after scale
        vector3Array.forEach(element => {
            element.scale(localScale.x, localScale.y, localScale.z);
        });

        //Get global Position
        vector3Array.forEach(element =>{
            element.add(meshData.owner.transform.position);
        })

        return vector3Array;
    }

    ConverVector3Array(array){
        let vector3Array = [];

        for(let i=0; i< array.length/3; i++){
            let startIndex = i*3;

            let x = array[startIndex];
            let y = array[startIndex+1];
            let z = array[startIndex+2];

            vector3Array.push(new Vector3(x,y,z));
        }
        return vector3Array;
    }


    GetShapePlanes(shape){
        let vertices = this.ConverVector3Array(shape.VertexPositions);

        let Planes = [];

        for(let i=0; i< vertices.length/4; i++){
            let startVertex = i*4;
            
            Planes.push({
                point1: vertices[startVertex],
                point2: vertices[startVertex+1],
                point3: vertices[startVertex+2],
                point4: vertices[startVertex+3]
            })
        }


        return Planes;
    }




    GetMinProjections(axis, vertices, position){
        let projections =[];

        let relativePositions =[];
        let minValue = 100000;

        vertices.forEach(vertex => {
            relativePositions.push(vertex.subtractby(position));
            
        });

        let normalizedAxis = axis.normalized();
        relativePositions.forEach(element => {
            let value = element.dot(normalizedAxis);
            if( value < minValue ){
                minValue = value;
            }
        });
        return minValue;
    }

    GetMaxProjections(axis, vertices, position){
        let projections =[];

        let relativePositions =[];
        let maxValue = -10000;

        vertices.forEach(vertex => {
            relativePositions.push(vertex.subtractby(position));
            
        });

        let normalizedAxis = axis.normalized();

        relativePositions.forEach(element => {
            let value = element.dot(normalizedAxis);
            if( value > maxValue){
                maxValue = value;
            }
        });

        return maxValue;
    }


    GetBoxExtents(vertices){
        if(vertices.length ==0){
            return;
        }

        let minX = vertices[0].x;
        let maxX = vertices[0].x;

        let minY = vertices[0].y;
        let maxY = vertices[0].y;

        let minZ = vertices[0].z;
        let maxZ = vertices[0].z;

        for(let i=1; i< vertices.length;i++){
            if (vertices[i].x<minX){
                minX = vertices[i].x;
            }
            if(vertices[i].x >maxX){
                maxX = vertices[i].x;
            }
            if (vertices[i].y<minY){
                minY = vertices[i].y;
            }
            if(vertices[i].y >maxY){
                maxY = vertices[i].y;
            }
            if (vertices[i].z<minZ){
                minZ = vertices[i].z
            }
            if(vertices[i].z >maxZ){
                maxZ = vertices[i].z;
            }
        }
        let result ={
            XAxis : 
                {
                    minX : minX ,
                    maxX : maxX
                } ,
            YAxis :
                {
                    minY :minY,
                    maxY :maxY
                } ,
            ZAxis :
                {
                    minZ :minZ,
                    maxZ :maxZ
                }
        }
        return result;
    }
}