import Scene from "./scene.js";

import Vector3 from "../Math/Vector3.js";
import GameObject from "../GameObject.js";

import MeshData from "../Components/MeshData.js";
import * as Shapes from "../ShapesData/Shape.js";


import RigidBody from "../Components/RigidBody.js";
import Input from "../Input.js";


export default class BallisticScene extends Scene{
    static BulletTypes = Object.freeze({"Pistol":1, "Fireball":2});
    constructor(){
        super();


        this._Camera.transform.position = new Vector3(0,20,200);
    }

    Step(){
        
        //console.time("Time per Scene Update");

        super.Step();
        if(Input.Key == Input.KeyKode.C){
            //this.spawnBullet(BallisticScene.BulletTypes.Pistol);
        }
        
        //console.timeEnd();
    }

    BuildScene(){
        // this.spawnBullet(BallisticScene.BulletTypes.Pistol);


        // this.spawnCube(new Vector3(10,70,20), new Vector3(-3,0,0));
        // this.spawnCube(new Vector3(50,30,20),new Vector3(1,10,10));
        // this.spawnCube(new Vector3(30,40,20),new Vector3(2,-10,-5));
        // this.spawnCube(new Vector3(20,30,50),new Vector3(2,-10,5));
        // this.spawnCube(new Vector3(60,30,10));
        // this.spawnCube(new Vector3(10,60,20));


        for(let i =0; i<5; i++){
            let x= Math.random()*100 -50;
            let z= Math.random()*100 -50;
            let y= Math.random()*50 ;

            let dx= Math.random()*10 -5;
            let dz= Math.random()*10 -5;
            let dy= Math.random()*10 -5;

            this.spawnCube(new Vector3(x,y,z), new Vector3(dx,dy,dz));
        }




        // this.spawnCube(new Vector3(-40,30,20));
        // this.spawnCube(new Vector3(-40,30,20));
        // this.spawnCube(new Vector3(-40,30,20));
        // this.spawnCube(new Vector3(-40,30,20));
        // this.spawnCube(new Vector3(-40,30,20));
        // this.spawnCube(new Vector3(-40,30,20));


        //Spawn plane
        let newGameObject =new GameObject();
        newGameObject.AddComponent("meshData",new MeshData(new Shapes.Plane()));
        newGameObject.transform.position = new Vector3(-2.0,-3, -5);

        this.spawnCube( new Vector3(-2.0,-3, -5));
        
        newGameObject.transform.scale(100,1,100);

        this.AddObject(this._SceneObject,newGameObject);
    }

    spawnCube(position, velocity){
        let newGameObject =new GameObject();
        var MeshDataComponent = newGameObject.AddComponent("meshData",new MeshData(new Shapes.Cube()));
        var rigidBody =newGameObject.AddComponent("RigidBody", new RigidBody());

        rigidBody.dumping = 0.999;
        rigidBody.Restitution = 0.9;
        rigidBody.Mass= 1.0;

        newGameObject.transform.position = position.copyVector();
        if(velocity){
            rigidBody.Velocity =velocity.copyVector();
        }else{
            rigidBody.Velocity = new Vector3(0,0,0);
        }
        newGameObject.transform.scale(3,3,3); 

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
                rigidBody.Mass= 1.0;
                //rigidBody.velocity =new Vector3(5,5,0);
                //rigidBody.GravityAcceleration =new Vector3(0,-1,0);
                rigidBody.dumping = 0.995;
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