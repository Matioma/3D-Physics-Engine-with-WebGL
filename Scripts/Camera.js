import GameObject from "./GameObject.js";
import Vector3 from "./Math/Vector3.js";
import Input from "./Input.js";

export default class Camera extends GameObject{
    constructor(){
        super();
        this.speed = 1;
    }

    Step(){
        if(Input.Key === Input.KeyKode.A){
            this.transform.position.add(new Vector3(- this.speed,0,0));
        }
        if(Input.Key === Input.KeyKode.D){
            this.transform.position.add(new Vector3( this.speed,0,0));
        }
        if(Input.Key === Input.KeyKode.W){
            this.transform.position.add(new Vector3(0,0,- this.speed));
        }
        if(Input.Key === Input.KeyKode.S){
            this.transform.position.add(new Vector3(0,0, this.speed));
        }
        if(Input.Key === Input.KeyKode.Shift){
            this.transform.position.add(new Vector3(0,- this.speed,0));
        }
        if(Input.Key === Input.KeyKode.Space){
            this.transform.position.add(new Vector3(0, this.speed,0));
        }
        // if(Input.Key === Input.KeyKode.Q){
        //     this.transform.rotate(0,1,0);
        // }

        // this.transform.rotate(0,1,0);

        // if(Input.Key === Input.KeyKode.KeyRight){
        //     this.transform.position.add(new Vector3(0.1,0,0));
        // }

        //  this.transform.position.add(new Vector3(0,0,0.1));


        // this.transform.position.add(new Vector3(0,1,0));
        // console.log(this.transform.position);


        // const components = Object.keys(this._components);
        // components.forEach(element => {
        //     this._components[element].Step();
        // });
    }
}