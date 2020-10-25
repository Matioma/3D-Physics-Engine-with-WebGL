import Component from "./Component.js";
import Time from "../Time.js";
import Vector3 from "../Math/Vector3.js";

//import ParticleForceGenerator from "../Physics/ParticleForceGenerator.js"
import ParticleForceRegistry from "../Physics/ParticleForceRegistry.js"
import GravityForceGenerator from "../Physics/ForceGenerators/GravityForceGenerator.js"

export default class RigidBody extends Component{
    constructor(){
        super();

        this.velocity = new Vector3(5,15.0,0);
        this.acceleration = new Vector3(0,0,0);
        this._forceComulative = new Vector3(0,0,0);

        
        let generator = new GravityForceGenerator();
        ParticleForceRegistry.Instance.registerParticle(this, generator);


        this.dumping =0.995;
        this._inverseMass = 0;
    }

    set InverseMass(value){
        this._inverseMass =value;
    }

    get InverseMass(){
        return this._inverseMass;
    }
    set Mass(value){
        if(value !=0){
            this._inverseMass = 1/value;
        }else{
            console.error("trying to set a mass of zero, are you sure you are not trying to set the InverseMass?");
        }
    }
    AddForce(forceVector){
        if(!forceVector instanceof Vector3){
            console.log("Error tried to add as force not a force");
        }
        this._forceComulative.add(forceVector);
    }
    resetComulativeForce(){
        this._forceComulative = new Vector3(0,0,0);
    }
    Step(){
        this.Integrate(Time.deltaTime);
        this.resetComulativeForce();
    }

    //INtegrates position, velocity and acceleration
    Integrate(delta){
       // this.acceleration.set(0,0,0);

        //Move the object
        this.owner.transform.position.add(this.velocity.multiplyBy(delta)); 

        //Get the acceleration change from forces applied
        let accelerationFromForces = this._forceComulative.multiplyBy(this.InverseMass); 
        this.acceleration.add(accelerationFromForces.multiplyBy(delta));

        //Add velocity based on Acceleration 
        this.velocity.add(this.acceleration.multiplyBy(delta));
        //Add damping to the velocity
        this.velocity.multiply(Math.pow(this.dumping,delta));
    }
}