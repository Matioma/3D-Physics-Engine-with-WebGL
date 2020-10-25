import RigidBody from "../Components/RigidBody.js"
import ParticleForceGenerator from "./ParticleForceGenerator.js"
import Time from "../Time.js"

export default class ParticleForceRegistry{
    static id = 0;
    static _instance;
    constructor(){
        this.Registry =[];
    }

    //Singleton
    static createIntance(){
        var object = new ParticleForceRegistry();
        return object;
    }

    static get Instance(){
        if(ParticleForceRegistry._instance ==null){
            ParticleForceRegistry._instance = ParticleForceRegistry.createIntance();
        }
        return ParticleForceRegistry._instance;
    }

    //Registers one Partice
    registerParticle(pRigidBody, pforceGenerator){
        let forceRegistryItem ={
            id : ParticleForceRegistry.id,
            rigidBody : pRigidBody,
            forceGenerator : pforceGenerator 
        }
        ParticleForceRegistry.id++;
        this.Registry.push(forceRegistryItem);
    }

    // unregisterParticle(pRigidBody, pforceGenerator){
    //     for (let i=0; i<ParticleForceRegistry.Instance.Registry.length; i++){
    //         if(deepEqual(pRigidBody, this.Registry[i].rigidBody) && deepEqual(pforceGenerator, this.Registry[i].forceGenerator)){
    //             this.Registry.splice(i, 1);
    //             return;
    //         }
    //     }
    // }
    clear(){
        console.log("cleared registery");
        this.Registry = [];
    }
    update(){
        for(let i=0; i<ParticleForceRegistry.Instance.Registry.length; i++){
            ParticleForceRegistry.Instance.Registry[i].forceGenerator.updateForce(ParticleForceRegistry.Instance.Registry[i].rigidBody,Time.DeltaTime);
        }
    }

    // deepEqual(object1, object2) {
    //     const keys1 = Object.keys(object1);
    //     const keys2 = Object.keys(object2);
      
    //     if (keys1.length !== keys2.length) {
    //       return false;
    //     }
      
    //     for (const key of keys1) {
    //       const val1 = object1[key];
    //       const val2 = object2[key];
    //       const areObjects = isObject(val1) && isObject(val2);
    //       if (
    //         areObjects && !deepEqual(val1, val2) ||
    //         !areObjects && val1 !== val2
    //       ) {
    //         return false;
    //       }
    //     }
    //     return true;
    //   }

}