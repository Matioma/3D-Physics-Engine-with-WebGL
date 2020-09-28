
import Vector3 from "./Math/Vector3.js";
import Transform from "./Components/Transform.js";

import GameObject from "./GameObject.js";
import Renderer from "./Renderer.js";

export class Scene{
    constructor(){
        this._SceneObject = [];
        this._SceneObject.push(new GameObject());

        this._Renderer = new Renderer(); 
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