import GameObject from "./GameObject.js";
import Vector3 from "./Math/Vector3.js";
import Input from "./Input.js";

export default class Camera extends GameObject{
    constructor(){
        super();
        this.speed = 3;
    }

    Step(){
        
        if(Input.Key === Input.KeyKode.A){
            this.transform.position.add(this.transform.Right.multiplyBy(-this.speed));
        }
        if(Input.Key === Input.KeyKode.D){
            this.transform.position.add(this.transform.Right.multiplyBy(this.speed));
        }
        if(Input.Key === Input.KeyKode.W){
            this.transform.position.add(this.transform.Forward.multiplyBy(this.speed));
        }
        if(Input.Key === Input.KeyKode.S){
            this.transform.position.add(this.transform.Forward.multiplyBy(-this.speed));
        }
        if(Input.Key === Input.KeyKode.Shift){
            this.transform.position.add(this.transform.Up.multiplyBy(-this.speed));
        }
        if(Input.Key === Input.KeyKode.Space){
            this.transform.position.add(this.transform.Up.multiplyBy(this.speed));
        }

        if(Input.Key === Input.KeyKode.Q){
            this.transform.rotate(0,3,0);
        }
        if(Input.Key === Input.KeyKode.E){
            this.transform.rotate(0,-3,0);
        }

    }
}