import Component from "./Component.js";
import Time from "../Time.js";
import Vector3 from "../Math/Vector3.js";

export default class RigidBody extends Component{
    constructor(){
        super();

        this.velocity = new Vector3(0.1,0,0);
        this.acceleration = new Vector3(0,0,0);
    }

    Step(){
        this.owner.transform.position.add(this.velocity.multiplyBy(Time.deltaTime));
        // this.owner.transform.rotate(0,1* Time.deltaTime,0);
    }
}