
import Vector3 from "./Math/Vector3.js";
import Transform from "./Components/Transform.js";

import GameObject from "./GameObject.js";
import Renderer from "./Renderer.js";

import MeshData from "./Components/MeshData.js";
import * as Shapes from "./ShapesData/Shape.js";
import Camera from "./Camera.js";
import RigidBody from "./Components/RigidBody.js";
import ParticleForceRegistry from "./Physics/ParticleForceRegistry.js";

export default class Scene{
    constructor(){
        this._SceneObject = [];
        this.BuildScene();

        this._Camera = new Camera();
        this._Camera.transform.position = new Vector3(0,0,50);
        this._Camera.transform.rotate(0,60,0);
        this._Renderer = new Renderer(this._Camera); 
    }
    get SceneObjects(){
        return this._SceneObject;
    }
    

    RestartScene(){
        this._SceneObject = [];
        this.BuildScene();
    }


    AddObject(collection, newObject){
        collection.push(newObject);
    }

    BuildScene(){
        //Create gameObject
        let box =new GameObject();
        var MeshDataComponent = box.AddComponent("meshData",new MeshData(new Shapes.Cube()));
        var RigidBodyComponent =box.AddComponent("RigidBody", new RigidBody());
        
        box.transform.position = new Vector3(-20.0,5.0, -5);
        box.transform.scale(3,3,3); 

        RigidBodyComponent.Mass = 1;
        RigidBodyComponent.AddForce(new Vector3(0.5,0,0));
        RigidBodyComponent.AddForce(new Vector3(-0.5,0,0));
        this.AddObject(this._SceneObject,box);



        let plane =new GameObject();
        plane.AddComponent("meshData",new MeshData(new Shapes.Plane()));
        plane.transform.position = new Vector3(-2.0,-10.0, -5);
        
        plane.transform.scale(50,1,50);

        // newGameObject.transform.scale =new Vector3(2,2,2);
        this.AddObject(this._SceneObject,plane);
    }

    Update(){
        ParticleForceRegistry.Instance.update()
        this.Step();
        this.draw();
    }

    Step(){
        this._Camera.Step();
        this._SceneObject.forEach(element => {
            element.Step();
        });
    }

    draw(){
        this._Renderer.draw(this);
    }
}