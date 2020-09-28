import {Renderer} from "./renderer.js";
import Vector3 from "./Math/Vector3.js";
import Transform from "./Components/Transform.js";

export class Scene{
    constructor(){
        const id = 3;

        this.transform = new Transform(3,3,3);
        // let component = new Component();
        // this.position = new Vector3(); 
        
    }

    Update(){
        this.transform.Update();

        // this.position.add(new Vector3(0,1,0));
        // this.position.add(1,0,0);
        // console.log(this.position.toString());
        this.step();
        this.draw();
    }

    step(){
    }

    draw(){

    }

}