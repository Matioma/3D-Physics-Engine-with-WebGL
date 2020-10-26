import RigidBody from "../Components/RigidBody.js"

export default class CollisionResolver{
    constructor(scene){
        this.GameObejects =scene.SceneObjects;
        
        this.RigidBodies =[];
        for(let i =0 ;i< this.GameObejects.length; i++){
            if(this.GameObejects[i].GetComponent("RigidBody")){
                this.RigidBodies.push(this.GameObejects[i].GetComponent("RigidBody"));
            }
        }
        console.log(this.RigidBodies);

        this.Collsions =[];
    
    }
    
    update(){
        this.RegisterCollsitions();
        this.registerCollsitions();
        this.Collsions =[];
    }

    registerCollsitions(){
        for(let i =0 ;i< this.GameObejects.length; i++){
            if(this.GameObejects[i].GetComponent("RigidBody")){


            }

        }

    }

    resolveCollisions(){


    }
    

}