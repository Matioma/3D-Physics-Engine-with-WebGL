
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
        this._Camera.transform.position = new Vector3(0,0,0);
        this._Renderer = new Renderer(this._Camera); 
    }
    get SceneObjects(){
        return this._SceneObject;
    }

    AddObject(collection, newObject){
        collection.push(newObject);
    }

    BuildScene(){
        let newGameObject =new GameObject();
        newGameObject.AddComponent("meshData",new MeshData(new Shapes.Cube()));
        newGameObject.AddComponent("RigidBody", new RigidBody());
        // console.log(newGameObject);
        newGameObject.transform.position = new Vector3(-0.0,0.0, -5);
        this.AddObject(this._SceneObject,newGameObject);

        // newGameObject =new GameObject();
        // newGameObject.AddComponent("meshData",new MeshData(new Shapes.Cube()));
        // // console.log(newGameObject);
        // newGameObject.transform.position = new Vector3(-0.0,4, -5);
        // this.AddObject(this._SceneObject,newGameObject);


        newGameObject =new GameObject();
        newGameObject.AddComponent("meshData",new MeshData(new Shapes.Plane()));
        newGameObject.transform.position = new Vector3(-2.0,-2.0, -5);
        
        newGameObject.transform.scale(2,2,2);

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