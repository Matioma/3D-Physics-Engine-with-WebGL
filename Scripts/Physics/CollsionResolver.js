import RigidBody from "../Components/RigidBody.js"
import Vector3 from "../Math/Vector3.js";
import Time from "../Time.js";
import PhysicsContact from "./PhysicsContact.js"

export default class CollisionResolver{
    constructor(scene){
        this.GameObejects =scene.SceneObjects;
        
        this.RigidBodies =[];
        for(let i =0 ;i< this.GameObejects.length; i++){
            if(this.GameObejects[i].GetComponent("RigidBody")){
                this.RigidBodies.push(this.GameObejects[i].GetComponent("RigidBody"));
            }
        }

        this.Collsions =[];
    
    }

    clear(){
        this.GameObejects =[];
        this.RigidBodies =[];
        this.Collsions =[];
    }
    
    update(){
        this.registerCollisions();
        this.resolveCollisions();
        this.Collsions.length =0;
    }

    registerCollisions(){
        for( let i=0; i< this.RigidBodies.length; i++){
            if(this.RigidBodies[i].owner.transform.position.y<0){
                let physicsContact  = new PhysicsContact(this.RigidBodies[i]);
                physicsContact.penetration = -this.RigidBodies[i].owner.transform.position.y;
                physicsContact.CollisionNormal = new Vector3(0,1,0);
                this.Collsions.push(physicsContact);
            }
            else if(this.RigidBodies[i].owner.transform.position.y>100){
                let physicsContact  = new PhysicsContact(this.RigidBodies[i]);
                physicsContact.penetration = -this.RigidBodies[i].owner.transform.position.y;
                physicsContact.CollisionNormal = new Vector3(0,-1,0);
                this.Collsions.push(physicsContact);
            }


            if(this.RigidBodies[i].owner.transform.position.x>50){
                let physicsContact  = new PhysicsContact(this.RigidBodies[i]);
                physicsContact.penetration = -this.RigidBodies[i].owner.transform.position.y;
                physicsContact.CollisionNormal = new Vector3(-1,0,0);
                this.Collsions.push(physicsContact);
            }
            if(this.RigidBodies[i].owner.transform.position.x<-50){
                let physicsContact  = new PhysicsContact(this.RigidBodies[i]);
                physicsContact.penetration = -this.RigidBodies[i].owner.transform.position.y;
                physicsContact.CollisionNormal = new Vector3(1,0,0);
                this.Collsions.push(physicsContact);
            }
            if(this.RigidBodies[i].owner.transform.position.z<-50){
                let physicsContact  = new PhysicsContact(this.RigidBodies[i]);
                physicsContact.penetration = -this.RigidBodies[i].owner.transform.position.y;
                physicsContact.CollisionNormal = new Vector3(0,0,1);
                this.Collsions.push(physicsContact);
            }
            if(this.RigidBodies[i].owner.transform.position.z>50){
                let physicsContact  = new PhysicsContact(this.RigidBodies[i]);
                physicsContact.penetration = -this.RigidBodies[i].owner.transform.position.y;
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
    

}