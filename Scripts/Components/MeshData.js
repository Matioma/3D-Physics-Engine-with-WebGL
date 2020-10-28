import Component from "./Component.js";
import * as Shapes from "../ShapesData/Shape.js";

export default class MeshData extends Component{
    constructor(MeshShape){
        super();

        this.isVisible =true;
        if(!(MeshShape instanceof Shapes.Shape)){
            console.error("Make sure you send as a parameter an object of type Shape");
        }
        this._shape = MeshShape;
    }

    Step(){
    }
}