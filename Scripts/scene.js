
import Vector3 from "./Math/Vector3.js";
import Transform from "./Components/Transform.js";

import GameObject from "./GameObject.js";
import Renderer from "./Renderer.js";

import MeshData from "./Components/MeshData.js";
import * as Shapes from "./ShapesData/Shape.js";
import Camera from "./Camera.js";
import RigidBody from "./Components/RigidBody.js";

export default class Scene{
    constructor(){
        this._SceneObject = [];
        
        this.BuildScene();

        this._Camera = new Camera();
        this._Camera.transform.position = new Vector3(0,0,50);
        this._Camera.transform.rotate(0,60,0);
        this._Renderer = new Renderer(this._Camera); 
    }
    get SceneObjects(){
        return this._SceneObject;
    }
    

    RestartScene(){
        this._SceneObject = [];
        this.BuildScene();
    }


    AddObject(collection, newObject){
        collection.push(newObject);
    }

    BuildScene(){
        //Create gameObject
        let newGameObject =new GameObject();
        var MeshDataComponent = newGameObject.AddComponent("meshData",new MeshData(new Shapes.Cube()));
        var RigidBodyComponent =newGameObject.AddComponent("RigidBody", new RigidBody());
        
        newGameObject.transform.position = new Vector3(-20.0,5.0, -5);
        newGameObject.transform.scale(3,3,3); 

        RigidBodyComponent.Mass = 1;
        RigidBodyComponent.AddForce(new Vector3(0.5,0,0));
        RigidBodyComponent.AddForce(new Vector3(-0.5,0,0));
        this.AddObject(this._SceneObject,newGameObject);


        // var e = m*s*s;



        // RigidBodyComponent.AddForce(new Vector3(0,1000,0));

        

        //
        newGameObject =new GameObject();
        newGameObject.AddComponent("meshData",new MeshData(new Shapes.Plane()));
        newGameObject.transform.position = new Vector3(-2.0,-20.0, -5);
        
        newGameObject.transform.scale(50,1,50);

        // newGameObject.transform.scale =new Vector3(2,2,2);
        this.AddObject(this._SceneObject,newGameObject);
    }

    Update(){
        this.Step();
        this.draw();
    }

    Step(){
        // this.Camera.Step();
        this._Camera.Step();
        this._SceneObject.forEach(element => {
            element.Step();
        });
    }

    draw(){
        this._Renderer.draw(this);
    }
}