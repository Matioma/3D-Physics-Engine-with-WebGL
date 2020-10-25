import RigidBody from "../Components/RigidBody.js"

export default class ParticleForceGenerator{
    constructor(){
        if(new.target === ParticleForceGenerator){
            console.error("Can not instantiate ParticleForceGenerator Directly, they must be inheritated \"Like abstract classes\" ");
            return;
        }
    }
    updateForce(rigidBody, deltaTime){
        console.error("You have not implemented the UpdateForceMethod");
    };
}