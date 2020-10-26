import ParticleForceGenerator from "./ParticleForceGenerator.js"
import Vector3 from "../../Math/Vector3.js"
import RigidBody from "../../Components/RigidBody.js"

export default class DragForceGenerator extends ParticleForceGenerator{
    constructor(drag){
        super();
        this.k1 = drag;
        this.k2 = drag*drag;

    }
    updateForce(rigidBody, deltaTime){
        if(!rigidBody instanceof RigidBody){
            console.error("Make sure thst it is a rigidBody")
        }

        rigidBody.Velocity

        let forceNormalized = rigidBody.Velocity.normalized();
        let fragCoefficient = rigidBody.Velocity.length();

        fragCoefficient =fragCoefficient*this.k1 + this.k2*fragCoefficient*fragCoefficient;

        console.log(rigidBody.Velocity + " = "+ forceNormalized.multiplyBy(-1*fragCoefficient));
        //let force = forceNormalized.multiplyBy(-1* (forceMagnitude*this.k1 + this.k2*forceMagnitude*forceMagnitude) );

        //console.log(forceMagnitude*this.k1 + this.k2*forceMagnitude*forceMagnitude);

        rigidBody.AddForce(forceNormalized.multiplyBy(-1*fragCoefficient));

        //console.log(forceNormalized);



        // if(!rigidBody.HasFiniteMass()){
        //     return;
        // }
        //rigidBody.AddForce(this.gravity.multiplyBy(rigidBody.Mass));
    };
}