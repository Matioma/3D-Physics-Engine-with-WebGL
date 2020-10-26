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
            this.Resitution = Restiution;
        }else{
            this.Resitution = 1;
        }
       

        this.penetration = 0;
    }

    Resolve(deltaTime){
        this.resolveVelocity(deltaTime);
        this.resolveInterPenetration(deltaTime);
    }

    get SeparatingVelocity(){
        let relativeVelocity = this.Particles[0].Velocity;
        if(this.Particles[1]) relativeVelocity.add(this.Particles[1].Velocity.multiplyBy(-1));
        return relativeVelocity.multiplyBy(this.CollisionNormal.normalized().length());
    }


    resolveInterPenetration(delta){
        if(this.penetration<=0) return;

        let totalInverseMass = this.Particles[0].InverseMass;
        if(this.Particles[1]) totalInverseMass.add(this.Particles[1].InverseMass);

        if(totalInverseMass<=0) return; 


        let movePerInverseMass = this.CollisionNormal.multiplyBy(-this.penetration/totalInverseMass);
        

        this.Particles[0].owner.transform.add(movePerInverseMass * this.Particles[0].InverseMass);

        if(this.Particles[1]){
            this.Particles[1].owner.transform.add(movePerInverseMass * this.Particles[1].InverseMass);
        }
    }

    resolveVelocity(deltaTime){
        let separatingVelocity = this.SeparatingVelocity;
        if(separatingVelocity>0){
            return;
        }

        let newSeparatingVelocity = separatingVelocity.multiplyBy(-1).multiplyBy(this.Resitution);

        let deltaVelocity =newSeparatingVelocity.copyVector().add(separatingVelocity.multiplyBy(-1));


        let totalInverseMass = this.Particles[0].InverseMass;
        if(this.Particles[1]) totalInverseMass.add(this.Particles[1].InverseMass);


        if(totalInverseMass<=0) return;

        let impulse = deltaVelocity.multiplyBy(1/totalInverseMass);
        let impulsePerInverseMass = this.CollisionNormal.multiplyBy(impulse);

        this.Particles[0].Velocity = this.Particles[0].Velocity.copyVector().add( impulsePerInverseMass.multiplyBy(this.Particles[0].InverseMass));

        if(this.Particles[1]){
            his.Particles[1].Velocity = this.Particles[1].Velocity.copyVector().add( impulsePerInverseMass.multiplyBy(-this.Particles[1].InverseMass));
        }
    }
}