import Component from "./Component.js";

export default class MeshData extends Component{
    constructor(vertexPositions,faceColors,indices,vertexNormals){
        super();

        const VertexPositions=vertexPositions;
        const FaceColors = faceColors;
        const Indices = indices;
        const VertexNormals = vertexNormals;
    }

    Step(){
        console.log("MeshData step");
    }
}