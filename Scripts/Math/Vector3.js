export default class Vector3{
    static Forward = new Vector3(0,0,-1);
    static Right = new Vector3(1,0,0);
    static Up = new Vector3(0,1,0);

    constructor(x =0, y =0, z =0 ){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toArray(){
        return[ this.x, this.y, this.z];
    }

    set(x, y,z){
        if((x instanceof Vector3) && (y == undefined || z==undefined )){
            this.x =x.x;
            this.y = x.y;
            this.z = x.z;
            return;
        }
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(x, y, z){
        //If only one parameter sent
        if((x instanceof Vector3) && (y == undefined || z==undefined)){
            this.x +=x.x;
            this.y += x.y;
            this.z += x.z;
            return;
        }

        
        this.x +=x;
        this.y += y;
        this.z += z;
    }
    subtract(newVector){
        this.add(-newVector.x, -newVector.y,-newVector.z);
    }

    multiply(value){
        this.x *=value;
        this.y *= value;
        this.z *= value;
    }

    multiplyBy(value){
        let vector = this.copyVector();
        vector.multiply(value);
        return vector;
    }

    sqrLength(){
        return this.x*this.x + this.y*this.y + this.z*this.z;
    }
    length(){
        return Math.sqrt(this.sqrLength());
    }
    normalize(){
        this.multiply(1/this.length());
    }
    normalized(){
        let newVector = new Vector3(this.x, this.y, this.z);
        newVector.normalize();
        return newVector;
    }

    scale(x,y,z){
        this.x *=x;
        this.y *= y;
        this.z *= z;
    }

    copyVector(){
        let newVector = new Vector3(this.x, this.y, this.z);
        return newVector;
    }
    toString(){
        return `x = ${this.x}, y = ${this.y}, z=${this.z}`;
    }
}