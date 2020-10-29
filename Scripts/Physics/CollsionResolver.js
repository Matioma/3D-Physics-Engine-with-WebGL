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
        this.resolveCollisions();
        this.Collsions.length =0;
    }

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
       

        let vertices2 = this.GetGlobalMeshData(meshData2);
        let normals2 =this.ConverVector3Array(meshData2._shape.VertexNormals);



         //Check if boundries overlap
        let boxExtents1 = this.GetBoxExtents(vertices1);
        let boxExtents2 = this.GetBoxExtents(vertices2);


       
        let overlap = (boxExtents1.XAxis.minX < boxExtents2.XAxis.maxX && boxExtents1.XAxis.maxX >= boxExtents2.XAxis.minX)&&
                    (boxExtents1.YAxis.minY < boxExtents2.YAxis.maxY && boxExtents1.YAxis.maxY >= boxExtents2.YAxis.minY)&&                                                               
                    (boxExtents1.ZAxis.minZ < boxExtents2.ZAxis.maxZ && boxExtents1.ZAxis.maxZ >= boxExtents2.ZAxis.minZ);
        
        
        if(!overlap){
            return;
        } 

        //Get rigidBody components
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
            collisionNormal: new Vector3(0,0,0),
            dotProduct:-Number.MIN_VALUE,
        }
        
        //Get CollisionNormal
        for( let i=0; i< vertices1.length; i++){
          
            for(let j=0; j<vertices2.length;j++){
                let vectorDifference =vertices1[i].subtractby(vertices2[j]);

                let dotProduct =vectorDifference.dot(normals2[j]);
                if(dotProduct>0){
                    if(dotProduct>biggestCollision.dotProduct){
                        biggestCollision.dotProduct = dotProduct;
                        biggestCollision.collisionNormal = normals2[j];

                    }
                    
                }
            }
        }


        let physicsContact = new PhysicsContact(rigidBody1,rigidBody2);

      
        physicsContact.CollisionNormal = biggestCollision.collisionNormal;    

       
        physicsContact.penetration =-biggestCollision.dotProduct;

        // physicsContact.CollisionNormal = normal;           
        // physicsContact.penetration =-OverlapVector.length();

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


    GetShapePlanes(meshData){
        let vertices =this.GetGlobalMeshData(meshData);
        let normals1 =this.ConverVector3Array(meshData._shape.VertexNormals);
        let Planes = [];

        for(let i=0; i< vertices.length/4; i++){
            let startVertex = i*4;
            
            let Plane = {
                vertices :[ vertices[startVertex],
                            vertices[startVertex+1],
                            vertices[startVertex+2],
                            vertices[startVertex+3]
                ],
                normal :normals1[startVertex]
            }

            Planes.push(Plane);
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