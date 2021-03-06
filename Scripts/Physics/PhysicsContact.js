'use strict';

import Vector3 from "../Math/Vector3.js" 
import RigidBody from "../Components/RigidBody.js"

export default class PhysicsContact{
    constructor(Particle1, Particle2, CollisionNormal, Restiution){
        if(!Particle1 instanceof RigidBody)
        {
            console.error("Physics contact required first argument to be a RigidBody");
        }
        if(!Particle2 instanceof RigidBody)
        {
            console.error("Physics contact required second argument to be a RigidBody");
        }

        this.Particles =[Particle1,Particle2];
        if(CollisionNormal) {
            this.CollisionNormal = CollisionNormal;
        }else{
            this.CollisionNormal = new Vector3(0,1,0);
        }
        if(Restiution){
            this.Restitution = Restiution;
        }else{
            this.Restitution = 0.95;
        }

        this.penetration = 0;
    }




    Resolve(deltaTime){
        this.resolveInterPenetration(deltaTime);
        this.resolveVelocity(deltaTime);
        
    }

    get SeparatingVelocity(){
        let relativeVelocity = this.Particles[0].Velocity;
        if(this.Particles[1]) relativeVelocity.add(this.Particles[1].Velocity.multiplyBy(-1));
        return relativeVelocity.multiplyBy(this.CollisionNormal.normalized().length());
    }


    resolveInterPenetration(delta){
        if(this.penetration<=0) return;

        // let totalInverseMass = this.Particles[0].InverseMass;
        // if(this.Particles[1]) totalInverseMass.add(this.Particles[1].InverseMass);

        // if(totalInverseMass<=0) return; 



        //let movePerInverseMass = this.CollisionNormal.multiplyBy(this.penetration/totalInverseMass);
        
        //this.Particles[0].owner.transform.position.add(this.CollisionNormal.multiplyBy(this.penetration));
        //console.log(this.penetration);

        this.Particles[0].owner.transform.position.add(this.CollisionNormal.multiplyBy(this.penetration));

        if(this.Particles[1]){
            this.Particles[1].owner.transform.position.add(this.CollisionNormal.multiplyBy(-this.penetration));
        }
    }

    resolveVelocity(deltaTime){

        
        let separatingVelocity = this.SeparatingVelocity;
        if(separatingVelocity>0){
            return;
        }

        let newVelocity1 =  this.Particles[0].Velocity.copyVector();
     

        
       // newVelocity.multiply(-1);

        if(this.CollisionNormal.x != 0){
            newVelocity1.x *= -1.0;
        }
        if(this.CollisionNormal.y != 0){
            newVelocity1.y *= -1.0;
        }
        if(this.CollisionNormal.z != 0){
            newVelocity1.z *= -1.0;
        }

        let speedTowardsFace =-this.Particles[0].Velocity.dot(this.CollisionNormal);
        let relfectVector =this.CollisionNormal.multiplyBy(2*speedTowardsFace);
        this.Particles[0].Velocity.add(relfectVector);
        this.Particles[0].Velocity.multiply(0.9);

        //console.log(this.Particles[0].Velocity);
        //console.log(this.CollisionNormal.multiplyBy(2*speedTowardsFace));
       


        
      //  console.log("------------------");
//console.log(newVelocity.length());
       // newVelocity.multiply(this.Particles[0].Restitution);
       // console.log(newVelocity.length());


       //this.Particles[0].Velocity =newVelocity1.multiplyBy(0.9);

        this.Particles[0].Velocity = newVelocity1.copyVector();

        if(this.Particles[1]){
         
                                                                                                                                          

            let speedTowardsFace =this.Particles[1].Velocity.dot(this.CollisionNormal);
           
            let relfectVector =this.CollisionNormal.multiplyBy(-2*speedTowardsFace);

            //console.log(this.CollisionNormal.multiplyBy(2*speedTowardsFace));
            this.Particles[1].Velocity.add(relfectVector);
            this.Particles[1].Velocity.multiply(0.9);
        }

       // let newSeparatingVelocity = separatingVelocity.multiplyBy(-1).multiplyBy(this.Restitution);




        // let deltaVelocity =newSeparatingVelocity; //.copyVector().add(separatingVelocity.multiplyBy(-1));
        
        
        // console.log(deltaVelocity);

        // let totalInverseMass = this.Particles[0].InverseMass;
        // if(this.Particles[1]) totalInverseMass.add(this.Particles[1].InverseMass);


        // if(totalInverseMass<=0) return;

        // let impulse = deltaVelocity.multiplyBy(1/totalInverseMass);
        // let impulsePerInverseMass = this.CollisionNormal.multiplyBy(impulse);





        // this.Particles[0].Velocity.add( impulsePerInverseMass.multiplyBy(this.Particles[0].InverseMass));

        // //this.Particles[0].Velocity = this.Particles[0].Velocity.copyVector().add( impulsePerInverseMass.multiplyBy(this.Particles[0].InverseMass));

        // if(this.Particles[1]){
        //     his.Particles[1].Velocity = this.Particles[1].Velocity.copyVector().add( impulsePerInverseMass.multiplyBy(-this.Particles[1].InverseMass));
        // }
    }
}