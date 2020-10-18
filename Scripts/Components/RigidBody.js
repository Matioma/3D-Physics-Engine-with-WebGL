import Component from "./Component.js";
import Time from "../Time.js";

export default class RigidBody extends Component{
    constructor(){
        super();
    }

    Step(){
        console.log(Time.deltaTime);
        this.owner.transform.rotate(0,1* Time.deltaTime,0);
    }
}