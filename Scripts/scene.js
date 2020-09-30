
import Vector3 from "./Math/Vector3.js";
import Transform from "./Components/Transform.js";

import GameObject from "./GameObject.js";
import Renderer from "./Renderer.js";

import MeshData from "./Components/MeshData.js";
import * as Shapes from "./ShapesData/Shape.js";

export class Scene{
    constructor(){
        this._SceneObject = [];
        
        this.BuildScene();

        

        this._Renderer = new Renderer(); 
    }

    AddObject(collection, newObject){
        collection.push(newObject);

    }

    BuildScene(){
        let newGameObject =new GameObject();
        newGameObject.AddComponent("meshData",new MeshData(new Shapes.Cube()));

        newGameObject.transform.position = new Vector3(10,10,10);
        console.log(newGameObject);
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

    }

}