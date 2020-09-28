import Vector3 from "../Math/Vector3.js"
import Component from "./Component.js";

export default class Transform extends Component{
    constructor(position, rotation, scale){
        super();
        if(!(position instanceof Vector3)){
            console.log("Ensure that the position is of Type Vector3");
        }
        if(!(rotation instanceof Vector3)){
            console.log("Ensure that the rotation is of Type Vector3");
        }
        if(!(scale instanceof Vector3)){
            console.log("Ensure that the scale is of Type Vector3");
        }

        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }

    // get position(){
    //     return this.position;
    // }
    // set position(newPosition){
    //     this.position.set(newPosition);
    // }
    Start(){
        // console.log("Transform Start Methods");
    }
    
    Update(){
        // console.log("Transform Update Methods");
    }

}