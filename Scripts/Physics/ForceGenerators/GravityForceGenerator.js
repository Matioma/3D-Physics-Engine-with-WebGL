import ParticleForceGenerator from "./ParticleForceGenerator.js"
import Vector3 from "../../Math/Vector3.js"
import RigidBody from "../../Components/RigidBody.js"

export default class GravityForceGenerator extends ParticleForceGenerator{
    constructor(){
        super();
        this.gravity = new Vector3(0,-0.1,0);
    }
    updateForce(rigidBody, deltaTime){
        if(!rigidBody instanceof RigidBody){
            console.error("Make sure thst it is a rigidBody")
        }

        if(!rigidBody.HasFiniteMass()){
            return;
        }
        rigidBody.AddForce(this.gravity.multiplyBy(rigidBody.Mass));
    };
}