import Scene from "../scene.js";

import Vector3 from "../Math/Vector3.js";
import Transform from "../Components/Transform.js";

import GameObject from "../GameObject.js";
import Renderer from "../Renderer.js";

import MeshData from "../Components/MeshData.js";
import * as Shapes from "../ShapesData/Shape.js";
import Camera from "../Camera.js";
import RigidBody from "../Components/RigidBody.js";

export default class BallisticScene extends Scene{
    constructor(){
        super();

        this._Camera.transform.position = new Vector3(0,0,200);

    }

    BuildScene(){
        let newGameObject =new GameObject();
        var MeshDataComponent = newGameObject.AddComponent("meshData",new MeshData(new Shapes.Cube()));
        var RigidBodyComponent =newGameObject.AddComponent("RigidBody", new RigidBody());
        
        newGameObject.transform.position = new Vector3(-20.0,5.0, -5);
        newGameObject.transform.scale(3,3,3); 

        RigidBodyComponent.Mass = 1;
        RigidBodyComponent.AddForce(new Vector3(0.5,0,0));
        RigidBodyComponent.AddForce(new Vector3(-0.5,0,0));
        this.AddObject(this._SceneObject,newGameObject);

        newGameObject =new GameObject();
        newGameObject.AddComponent("meshData",new MeshData(new Shapes.Plane()));
        newGameObject.transform.position = new Vector3(-2.0,-20.0, -5);
        
        newGameObject.transform.scale(100,1,100);

        // newGameObject.transform.scale =new Vector3(2,2,2);
        this.AddObject(this._SceneObject,newGameObject);
    }
}