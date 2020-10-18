export default class Time{
    static lastTime = Date.now();
    static deltaTime = 0;
    

    static get DeltaTime(){
        return Time.deltaTime;
    }
    static UpdateDeltaTime(){
        let now = Date.now();
        Time.deltaTime = (now -this.lastTime)/100; //convert to seconds
        Time.lastTime = now;
    }
}