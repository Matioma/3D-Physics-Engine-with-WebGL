import Component from "./Component.js";
import Time from "../Time.js";
import Vector3 from "../Math/Vector3.js";

import ParticleForceRegistry from "../Physics/ParticleForceRegistry.js"
import GravityForceGenerator from "../Physics/ForceGenerators/GravityForceGenerator.js"
import DragForceGenerator from "../Physics/ForceGenerators/DragForceGenerator.js"


export default class RigidBody extends Component{
    constructor(){
        super();

        this._velocity = new Vector3(0,0.0,0);
        this.acceleration = new Vector3(0,0,0);
        this._forceComulative = new Vector3(0,0,0);

        this._restitution = 1;
        
        let gravityGenerator = new GravityForceGenerator();

        ParticleForceRegistry.Instance.registerParticle(this, gravityGenerator);


        this.dumping =0.95;
        this._inverseMass = 0;
    }

    set Restitution(value){
        this._restitution = value;
    }

    get Restitution(){
        return this._restitution;
    }

    get Velocity(){
        //console.error( this._velocity);
        return this._velocity;
    }

    set Velocity(value){
        //console.error(value);
        this._velocity.set(value.x,value.y,value.z); 
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
    get Mass(){
        return 1/this.InverseMass;
    }
    HasFiniteMass(){
        return this._inverseMass !=0;
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
        this.acceleration.set(0,0,0);


        // if(this.Velocity.y<0)
        //     console.log("---------- Velocity from Rigid Body ----------")
        //Move the object
        this.owner.transform.position.add(this.Velocity.multiplyBy(delta)); 
        
        // if(this.Velocity.y<0)
        // console.log(this.Velocity.length());

        //Get the acceleration change from forces applied
        let accelerationFromForces = this._forceComulative.multiplyBy(this.InverseMass); 
        this.acceleration.add(accelerationFromForces.multiplyBy(delta));

       // console.log(accelerationFromForces.multiplyBy(delta));
        //this.acceleration.add(new Vector3(0,-0.5,0));

        //console.log(accelerationFromForces);

        // console.log("--------");
        // console.log(this._forceComulative);
        // console.log("--------");
        
        //console.log(this._forceComulative.multiplyBy(this.InverseMass));
        //Add velocity based on Acceleration 
        this.Velocity.add(this.acceleration.multiplyBy(delta));
        //Add damping to the velocity
        //this._velocity.multiply(Math.pow(this.dumping,delta));
        this.Velocity.multiply(this.dumping);
       
        // if(this.Velocity.y<0)
        //     console.log(this.Velocity.length());
        //console.log(this.Velocity);
        // console.log(this.Velocity);

       //console.log(this._velocity);
    }
}