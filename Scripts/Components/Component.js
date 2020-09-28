export default class Component{
    constructor(){
        if(new.target === Component){
            console.log("Can not instantiate Component Directly, they must be inheritated \"Like abstract classes\" ");
            return;
        }
        this.Start();
    }
    Start(){};
    Update(){};
}