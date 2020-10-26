import RigidBody from "../Components/RigidBody.js"
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
        this.Collsions =[];
    }

    registerCollisions(){
        for( let i=0; i< this.RigidBodies.length; i++){
            if(this.RigidBodies[i].owner.transform.position.y<0){
                let physicsContact  = new PhysicsContact(this.RigidBodies[i]);
                physicsContact.penetration = -this.RigidBodies[i].owner.transform.position.y;
                this.Collsions.push(physicsContact);

            }else{

            }
        }
    }

    resolveCollisions(){
        for( let i=0; i< this.Collsions.length; i++){
           this.Collsions[i].Resolve(Time.DeltaTime);
        }
    }
    

}