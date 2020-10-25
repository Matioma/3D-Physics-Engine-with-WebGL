import ParticleForceGenerator from "./ParticleForceGenerator.js"
import Vector3 from "../../Math/Vector3.js"
import RigidBody from "../../Components/RigidBody.js"

export default class GravityForceGenerator extends ParticleForceGenerator{
    constructor(){
        super();
        this.gravity = new Vector3(0,-2.0,0);
    }
    updateForce(rigidBody, deltaTime){
        if(!rigidBody instanceof RigidBody){
            console.error("Make sure thst it is a rigidBody")
        }
        rigidBody.AddForce(this.gravity);
    };
}