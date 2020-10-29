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


        this._Camera.transform.position = new Vector3(100,85,317);
    }

    Step(){
        super.Step();
    }

    BuildScene(){

        for(let i =0; i<25; i++){
            let x= Math.random()*190 -95;
            let z= Math.random()*190 -95;
            let y= Math.random()*100 +1 ;

            // x =10;
            // z =20;

            let dx= Math.random()*5 -3;
            let dz= Math.random()*5 -3;
            let dy= Math.random()*5 -3;

            //  dx =10;
            //  dz =10;


            this.spawnCube(new Vector3(x,y,z), new Vector3(dx,dy,dz));
        }





        //Spawn plane
        let newGameObject =new GameObject();
        newGameObject.AddComponent("meshData",new MeshData(new Shapes.Plane()));
        newGameObject.transform.position = new Vector3(0,0,0);
        newGameObject.transform.scale(100,1,100);
        this.AddObject(this._SceneObject,newGameObject);


        {
            let newGameObject =new GameObject();
            var MeshDataComponent = newGameObject.AddComponent("meshData",new MeshData(new Shapes.Cube()));
            newGameObject.transform.position = new Vector3(0,100,-100.5);
            newGameObject.transform.scale(100,100,2); 
            this.AddObject(this._SceneObject,newGameObject);
        }
        {
            let newGameObject =new GameObject();
            var MeshDataComponent = newGameObject.AddComponent("meshData",new MeshData(new Shapes.Cube()));
            newGameObject.transform.position = new Vector3(-100.0,100,0);
            newGameObject.transform.scale(3,100,100); 
            this.AddObject(this._SceneObject,newGameObject);
        }

        {
            let newGameObject =new GameObject();
            var MeshDataComponent = newGameObject.AddComponent("meshData",new MeshData(new Shapes.Cube()));
            MeshDataComponent.isVisible =false;
            newGameObject.transform.position = new Vector3(100.0,100,0);
            newGameObject.transform.scale(3,100,100); 
            this.AddObject(this._SceneObject,newGameObject);
        }
        {
            let newGameObject =new GameObject();
            var MeshDataComponent = newGameObject.AddComponent("meshData",new MeshData(new Shapes.Cube()));
            MeshDataComponent.isVisible =false;
            newGameObject.transform.position = new Vector3(0,50,100.0);
            newGameObject.transform.scale(100,100,3); 
            this.AddObject(this._SceneObject,newGameObject);
        }
        {
            let newGameObject =new GameObject();
            var MeshDataComponent = newGameObject.AddComponent("meshData",new MeshData(new Shapes.Cube()));
            MeshDataComponent.isVisible =true;
            newGameObject.transform.position = new Vector3(0,200,0);
            newGameObject.transform.scale(100,3,100); 
            this.AddObject(this._SceneObject,newGameObject);
    

        }
     
      
    }

    spawnCube(position, velocity){
        let newGameObject =new GameObject();
        var MeshDataComponent = newGameObject.AddComponent("meshData",new MeshData(new Shapes.Cube()));
        var rigidBody =newGameObject.AddComponent("RigidBody", new RigidBody());



        rigidBody.dumping = 0.99;
        
        rigidBody.Restitution = 0.99;
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