
export default class Input{
    static  KeyKode = Object.freeze({"KeyUp":1, "KeyDown":2, "KeyLeft":3, "KeyRight":4, "A": 5, "S":6, "D":7, "W":8, "Shift":9, "Space":10});    

    static set Key(data){ 
        Input.key = data; 
    } 
    static get Key(){ 
        return Input.key; 
    } 
}