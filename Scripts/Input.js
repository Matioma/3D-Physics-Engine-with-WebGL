
export default class Input{
    constructor(){
        if( typeof Input.Instance == 'undefined' ) {
            Input.Instance =  new Input();
        }
        this.x = 3;
    }
}