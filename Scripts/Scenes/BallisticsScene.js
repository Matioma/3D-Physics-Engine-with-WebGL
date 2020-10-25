import Scene from "../scene.js";

import Vector3 from "../Math/Vector3.js";
import Transform from "../Components/Transform.js";

import GameObject from "../GameObject.js";
import Renderer from "../Renderer.js";

import MeshData from "../Components/MeshData.js";
import * as Shapes from "../ShapesData/Shape.js";
import Camera from "../Camera.js";
import RigidBody from "../Components/RigidBody.js";
import Input from "../Input.js";

import ParticleForceRegistry from "../Physics/ParticleForceRegistry.js"

export default class BallisticScene extends Scene{
    static BulletTypes = Object.freeze({"Pistol":1, "Fireball":2});
    constructor(){
        super();

        //ParticleForceRegistry.Instance.clear();
        console.log(ParticleForceRegistry.Instance);
        this._Camera.transform.position = new Vector3(0,20,200);
    }

    Step(){
        super.Step();
        if(Input.Key == Input.KeyKode.C){
            this.spawnBullet(BallisticScene.BulletTypes.Pistol);
        }
    }

    BuildScene(){
        this.spawnBullet(BallisticScene.BulletTypes.Pistol);


        //Spawn plane
        let newGameObject =new GameObject();
        newGameObject.AddComponent("meshData",new MeshData(new Shapes.Plane()));
        newGameObject.transform.position = new Vector3(-2.0,-20.0, -5);
        
        newGameObject.transform.scale(100,1,100);

        this.AddObject(this._SceneObject,newGameObject);
    }


    spawnBullet(shotType){

        let newGameObject =new GameObject();
        var MeshDataComponent = newGameObject.AddComponent("meshData",new MeshData(new Shapes.Cube()));
        var rigidBody =newGameObject.AddComponent("RigidBody", new RigidBody());
        
        newGameObject.transform.position = new Vector3(-20.0,20.0, -5);
        newGameObject.transform.scale(3,3,3); 
        

        //let rigidBody = new RigidBody();

        switch (shotType){
            case BallisticScene.BulletTypes.Pistol:
                rigidBody.Mass= 2.0;
                rigidBody.velocity =new Vector3(10,10,0);
                rigidBody.GravityAcceleration =new Vector3(0,-1,0);
                rigidBody.dumping = 0.99;
                break;
            case BallisticScene.BulletTypes.Fireball:
                rigidBody.Mass= 1.0;
                rigidBody.velocity =new Vector3(10,0,0);
                //rigidBody.acceleration = new Vector3(0,0.6,0);
                rigidBody.GravityAcceleration =new Vector3(0,0.6,0);
                rigidBody.dumping = 0.9;
                break;
        }

        this.AddObject(this._SceneObject,newGameObject);
    }
}