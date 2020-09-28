export default class Vector3{
    constructor(x =0, y =0, z =0 ){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    set(x, y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(x, y, z){
        if(y == undefined || z==undefined){
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

    sqrLength(){
        return this.x*this.x + this.y*this.y + this.z*this.z;
    }
    length(){
        return Math.sqrt(sqrLength());
    }
    normalize(){
        this.multiply(1/length());
    }
    normalized(){
        newVector = new Vector3(this.x, this.y, this.z);
        newVector.normalize();
        return newVector;
    }

    copyVector(){
        newVector = new Vector3(this.x, this.y, this.z);
        return newVector;
    }
    toString(){
        return `x = ${this.x}, y = ${this.y}, z=${this.z}`;
    }
}