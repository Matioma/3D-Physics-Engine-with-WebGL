// import Renderer from "./Renderer.js";
import {fsSource} from "./Shaders/fragmentShader.js";
import {vsSource} from "./Shaders/vertexShader.js" 

import Scene from "./scene.js";

import Input from "./Input.js";

let currentScene;

Input.Key = 3;
console.log(Input.Key);




Setup();
function Setup(){
    currentScene = new Scene();
}
function Update(){
    currentScene.Update();
    requestAnimationFrame(Update);
    Input.key = undefined;
}
requestAnimationFrame(Update);


// Pull input Events
window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

  
    switch (event.key) {
        case "ArrowDown":
            Input.Key = Input.KeyKode.KeyDown;
            break;
        case "ArrowUp":
            Input.Key = Input.KeyKode.KeyUp;
            break;
        case "ArrowLeft":
            Input.Key = Input.KeyKode.KeyLeft;
            break;
        case "ArrowRight":
            Input.Key = Input.KeyKode.KeyRight;
            break;
        case "a":
            Input.Key = Input.KeyKode.A;
            break;
        case "s":
            Input.Key = Input.KeyKode.S;
            break;
        case "d":
            Input.Key = Input.KeyKode.D;
            break;
        case "w":
            Input.Key = Input.KeyKode.W;
            break;
        case "Shift":
            Input.Key = Input.KeyKode.Shift;
            break;
        case " ":
            Input.Key = Input.KeyKode.Space;
            break;
      default:
        return;
    }
    // event.preventDefault();
}, true);