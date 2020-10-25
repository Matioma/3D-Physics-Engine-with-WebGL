
import Scene from "./Scenes/scene.js";

import Input from "./Input.js";
import Time from "./Time.js";
import BallisticScene from "./Scenes/BallisticsScene.js";

let currentScene;

Setup();
function Setup(){
    //currentScene = new Scene();
    currentScene = new BallisticScene();
}
function Update(){
    if(Input.Key == Input.KeyKode.R){
        currentScene.RestartScene();
    }

    
    currentScene.Update();
    Input.key = undefined;
    Time.UpdateDeltaTime();
    
    requestAnimationFrame(Update);
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
        case "q":
            Input.Key = Input.KeyKode.Q;
            break;
        case "e":
            Input.Key = Input.KeyKode.E;
            break;
        case "r":
            Input.Key = Input.KeyKode.R;
            break;
        case "c":
            Input.Key = Input.KeyKode.C;
            break;
      default:
        return;
    }
}, true);