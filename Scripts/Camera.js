import GameObject from "./GameObject.js";
import Vector3 from "./Math/Vector3.js";

export default class Camera extends GameObject{
    constructor(){
        super();
    }

    Step(){
        this.transform.position.add(new Vector3(0,1,0));
        // console.log(this.transform.position);


        const components = Object.keys(this._components);
        components.forEach(element => {
            this._components[element].Step();
        });
    }
}