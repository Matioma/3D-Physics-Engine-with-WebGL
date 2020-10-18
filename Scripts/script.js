// import Renderer from "./Renderer.js";
import {fsSource} from "./Shaders/fragmentShader.js";
import {vsSource} from "./Shaders/vertexShader.js" 

import Scene from "./scene.js";


let currentScene;



Setup();
function Setup(){
    currentScene = new Scene();
}
function Update(){
    currentScene.Update();
    requestAnimationFrame(Update);
}
requestAnimationFrame(Update);
