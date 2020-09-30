
import Vector3 from "./Math/Vector3.js";
import Transform from "./Components/Transform.js";

import GameObject from "./GameObject.js";
import Renderer from "./Renderer.js";

import MeshData from "./Components/MeshData.js";
import * as Shapes from "./ShapesData/Shape.js";

export default class Scene{
    constructor(){
        this._SceneObject = [];
        
        this.BuildScene();

        console.log(this._SceneObject);
        this._Renderer = new Renderer(); 
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

        console.log(newGameObject);
        newGameObject.transform.position = new Vector3(-0.0,0.0, -5);
        this.AddObject(this._SceneObject,newGameObject);


        newGameObject =new GameObject();
        newGameObject.AddComponent("meshData",new MeshData(new Shapes.Cube()));
        newGameObject.transform.position = new Vector3(-2.0,2.0, -5);
        this.AddObject(this._SceneObject,newGameObject);
    }

    Update(){
        this.Step();
        this.draw();
    }

    Step(){
        this._SceneObject.forEach(element => {
            element.Step();
        });
    }

    draw(){
        this._Renderer.draw(this);
    }

}