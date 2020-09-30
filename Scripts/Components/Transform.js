import Vector3 from "../Math/Vector3.js"
import Component from "./Component.js";

export default class Transform extends Component{
    constructor(){
        super();

        this._position = new Vector3();
        this._rotation = new Vector3();
        this._scale = new Vector3(1,1,1);
    }

    get position(){
        return this._position;
    }
    set position(newPosition){
        this._position.set(newPosition);
    }

    get rotation(){
        return this._rotation;
    }
    set rotation(newRotation){
        this._rotation.set(newRotation);
    }


    get scale(){
        return this._scale;
    }
    get rotation(newScale){
        this._scale.set(newScale);
    }

    //Rotates the object
    rotate(x,y,z){
        //If only one parameter is sent
        if(y == undefined || z == undefined){
            //check if sent parameter is Vector3
            if(x instanceof Vector3){
                this._rotation.add(x);
            }else{
                console.error("Make sure the Parameter is a vector3 object");                
            }
            return;
        }
        this._rotation.add(x,y,z);
    }
    //Sets the scale of the object
    scale(x,y,z){
        if(y == undefined || z == undefined){
            //check if sent parameter is Vector3
            if(x instanceof Vector3){
                this._scale = x.copyVector();
            }else{
                console.error("Make sure the Parameter is a vector3 object");                
            }
            return;
        }
        this._rotation.set(x,y,z);
    }
    Start(){
        // console.log("Transform Start Methods");
    }
    
    Step(){
        //  console.log("Transform Step Method");
    }

}