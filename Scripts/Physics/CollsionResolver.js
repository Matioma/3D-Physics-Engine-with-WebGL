import MeshData from "../Components/MeshData.js";
import RigidBody from "../Components/RigidBody.js"
import Vector3 from "../Math/Vector3.js";
import Time from "../Time.js";
import PhysicsContact from "./PhysicsContact.js"

export default class CollisionResolver{
    constructor(scene){
        this.GameObjects =scene.SceneObjects;
        
        this.RigidBodies =[];
        for(let i =0 ;i< this.GameObjects.length; i++){
            if(this.GameObjects[i].GetComponent("RigidBody")){
                this.RigidBodies.push(this.GameObjects[i].GetComponent("RigidBody"));
            }
        }

        this.Collsions =[];
    
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
            for(let j = i;j< this.GameObjects.length; j++){
                //console.log("test");
                let collision = this.CheckCollision(this.GameObjects[i], this.GameObjects[j]);
                if(collision){
                    this.Collsions.push(collision);
                }
            }
        }


        for( let i=0; i< this.RigidBodies.length; i++){
            if(this.RigidBodies[i].owner.transform.position.y<0){
                let physicsContact  = new PhysicsContact(this.RigidBodies[i]);
                physicsContact.penetration = this.RigidBodies[i].owner.transform.position.y;
                physicsContact.CollisionNormal = new Vector3(0,1,0);
                this.Collsions.push(physicsContact);
            }
            else if(this.RigidBodies[i].owner.transform.position.y>100){
                let physicsContact  = new PhysicsContact(this.RigidBodies[i]);
                physicsContact.penetration = this.RigidBodies[i].owner.transform.position.y - 100;
                physicsContact.CollisionNormal = new Vector3(0,-1,0);
                this.Collsions.push(physicsContact);
            }


            if(this.RigidBodies[i].owner.transform.position.x>50){
                let physicsContact  = new PhysicsContact(this.RigidBodies[i]);
                physicsContact.penetration = this.RigidBodies[i].owner.transform.position.x - 50;
                physicsContact.CollisionNormal = new Vector3(-1,0,0);
                this.Collsions.push(physicsContact);
            }
            if(this.RigidBodies[i].owner.transform.position.x<-50){
                let physicsContact  = new PhysicsContact(this.RigidBodies[i]);
                physicsContact.penetration = -this.RigidBodies[i].owner.transform.position.x -50;
                physicsContact.CollisionNormal = new Vector3(1,0,0);
                this.Collsions.push(physicsContact);
            }
            if(this.RigidBodies[i].owner.transform.position.z<-50){
                let physicsContact  = new PhysicsContact(this.RigidBodies[i]);
                physicsContact.penetration = -this.RigidBodies[i].owner.transform.position.z -50;
                physicsContact.CollisionNormal = new Vector3(0,0,1);
                this.Collsions.push(physicsContact);
            }
            if(this.RigidBodies[i].owner.transform.position.z>50){
                let physicsContact  = new PhysicsContact(this.RigidBodies[i]);
                physicsContact.penetration = this.RigidBodies[i].owner.transform.position.z -50;
                physicsContact.CollisionNormal = new Vector3(0,0,-1);
                this.Collsions.push(physicsContact);
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





       let vertices1 =  this.GetGlobalMeshData(meshData1);
       let vertices2 = this.GetGlobalMeshData(meshData2);
       // console.table([meshData1, meshData2]);
        //console.l
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
}