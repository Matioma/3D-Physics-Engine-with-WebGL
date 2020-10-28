import Vector3 from "./Math/Vector3.js";
import Transform from "./Components/Transform.js";
import Component from "./Components/Component.js";
import CollisionResolver from "./Physics/CollsionResolver.js";

export default class GameObject {
    constructor(){
        this._components ={};
        this._transform = this.AddComponent("transform",new Transform()); 
      
    }
    get transform(){
        return this._transform;
    }


    //Adds a component to the gameObject
    AddComponent(TypeName, component){
        if(component instanceof Component){
            this._components[TypeName] = component;
            component.owner = this;
        }else{
            console.error("Tried to add A non component as a component");
        }
        return component;
    }
    //Removes a specific component
    RemoveComponent(TypeName){
        delete  this._components[TypeName];
    }
    //Finds a component
    GetComponent(TypeName){
        let component = this._components[TypeName];
        if(component == undefined){
            //console.error(`Could not find the Requrested Component of ${TypeName}`);
            return null;
        }
        return component;
    }

    //Updates all the components
    Step(){
        const components = Object.keys(this._components);
        components.forEach(element => {
            this._components[element].Step();
        });

       // CollisionResolver.Instance.step(this);

        //console.log(CollisionResolver.Instance);
    }
    
}