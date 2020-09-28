import {Renderer} from "./Renderer.js";
import Vector3 from "./Math/Vector3.js";

import GameObject from "./GameObject.js";
import Transform from "./Components/Transform.js";


export class Scene{
    constructor(){
        const id = 3;

        this.GameObject = new GameObject();

        // console.log(this.GameObject.GetComponent("transform"));
    }

    Update(){
        this.Step();
        this.draw();
    }

    Step(){
        this.GameObject.Step();
    }

    draw(){

    }

}