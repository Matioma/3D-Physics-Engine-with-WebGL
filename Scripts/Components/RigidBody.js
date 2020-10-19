import Component from "./Component.js";
import Time from "../Time.js";
import Vector3 from "../Math/Vector3.js";

export default class RigidBody extends Component{
    constructor(){
        super();

        this.velocity = new Vector3(5,5.0,0);
        this.acceleration = new Vector3(0,0,0);

        this._comulativeForce = new Vector3(0,0,0);

        this.dumping =0.995;
        this._inverseMass = 0;
        this.GravityAcceleration =new Vector3(0,-2,0);
    }
    // get GravityAcceleration(){
    //     return  this.GravityAcceleration();
    // }
    // get GravityAcceleration(){
    //     return  this.GravityAcceleration();
    // }

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
        this._comulativeForce.add(forceVector);
    }
    resetComulativeForce(){
        this._comulativeForce = new Vector3(0,0,0);
    }
    Step(){
       // this.Integrate(Time.deltaTime);
    }

    //INtegrates position, velocity and acceleration
    Integrate(delta){
        this.acceleration.set(0,0,0);

        //Update Position based on velocity
        this.owner.transform.position.add(this.velocity.multiplyBy(delta)); 

        //Update acceleration based on forces
        let accelerationFromForces = this._comulativeForce.multiplyBy(this.InverseMass); 

        this.acceleration.add(this.GravityAcceleration.multiplyBy(delta)); // Add gravity acceleration
        this.acceleration.add(accelerationFromForces.multiplyBy(this.InverseMass)); //Apply continuous forces
       
        //Add velocity based on Acceleration 
        this.velocity.add(this.acceleration.multiplyBy(delta));
        //Add damping to the velocity
        this.velocity.multiply(Math.pow(this.dumping,delta));
    }
}