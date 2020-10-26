import {fsSource} from "./Shaders/fragmentShader.js";
import {vsSource} from "./Shaders/vertexShader.js" 

import Scene from "./Scenes/scene.js";
import Camera from "./Camera.js";

export default class Renderer{
    constructor(camera){
        console.log("Renderer created");
        this.Initialize();

        if(camera instanceof Camera){
            console.log("Camera attached to renderer");
            this.camera =camera;
        }
    };

    Initialize(){
        let canvas = document.getElementById("canvas");
        this.gl = canvas.getContext("webgl");

        if(this.gl ==null){
            console.error("The browser does not support WebGL");
        }
        this.shaderProgram = this.InitShaderProgram(this.gl,vsSource,fsSource);

        this.programInfo ={
            program: this.shaderProgram,
            attribLocations: {
                vertextPosition: this.gl.getAttribLocation(this.shaderProgram,"aVertexPosition"),
                vertextColor: this.gl.getAttribLocation(this.shaderProgram,"aVertexColor"),
                vertexNormals: this.gl.getAttribLocation(this.shaderProgram,"aVertexNormal")
            },
            uniformLocations:{
                projectionMatrix: this.gl.getUniformLocation(this.shaderProgram,"uProjectionMatrix"),
                uModelViewMatrix: this.gl.getUniformLocation(this.shaderProgram,"uModelViewMatrix"),
                uNormalMatrix: this.gl.getUniformLocation(this.shaderProgram,"uNormalMatrix"),
                uViewProjectionMatrix:this.gl.getUniformLocation(this.shaderProgram, "uViewProjectionMatrix")
            },
        }
        // const buffers =this.initBuffers(this.gl);
        // this.drawScene(this.gl,this.programInfo,buffers);
    }
    draw(scene){
        this.gl.clearColor(0.0,0.0,0.0,1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
    
        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        if(!(scene instanceof Scene)){
            console.error("Make sure the poarameter is a instance of  Scene");
        }
        for(let i=0; i<scene.SceneObjects.length;i++){
            const transform = scene.SceneObjects[i].transform;
            const buffers = this.bufferData(scene.SceneObjects[i].GetComponent("meshData"));

            this.drawMesh(this.gl,this.programInfo,buffers,transform);
        }
    }

    bufferData(meshData){
        if(meshData == undefined) return;

        const positionBuffer = this.gl.createBuffer();  
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array( meshData._shape.VertexPositions), this.gl.STATIC_DRAW); 

        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(meshData._shape.FaceColors),this.gl.STATIC_DRAW);

        const normalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,normalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(meshData._shape.VertexNormals),this.gl.STATIC_DRAW);
    
        const indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(meshData._shape.Indices), this.gl.STATIC_DRAW);

       
        return{
            position:positionBuffer,
            normal:normalBuffer,
            color:colorBuffer,
            indices: indexBuffer,

            lengthOfIndices: meshData._shape.Indices.length
        };
        
    }
    


    drawMesh(gl,programInfo,buffers, gameObject){
         //Projection matrix parameters
        const fieldOfView = 45 *Math.PI/180; 
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear =0.1;
        const zFar = 1000;
    
        //Create projection matrix
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);


         //Create model matrix
        const modelMatrix = mat4.create();
      
   

        mat4.translate(
            modelMatrix,
            modelMatrix,
            gameObject.position.toArray());

        mat4.rotate(
            modelMatrix,
            modelMatrix,
            1/180 * gameObject._rotation.z, //amount to rotate in radians
            [0,0,1]); // rotate around which axis

        mat4.rotate(
            modelMatrix,
            modelMatrix,
            1/180 * gameObject._rotation.y, //amount to rotate in radians
            [0,1,0]); // rotate around which axis

        mat4.rotate(
            modelMatrix,
            modelMatrix,
            1/180 * gameObject._rotation.x, //amount to rotate in radians
            [1,0,0]); // rotate around which axis
            
        mat4.scale(
            modelMatrix,
            modelMatrix,
            // transform._scale.toArray());
            gameObject._scale.toArray());
     
        const viewProjectionMatrix = mat4.create();
        if(this.camera != undefined){
            var vec3 =this.camera.transform.position;

            const CameraMatrix =mat4.create();
            mat4.translate(
                CameraMatrix,
                CameraMatrix,
                vec3.toArray()
            )
            mat4.rotate(
                CameraMatrix,
                CameraMatrix,
                1/180 * this.camera.transform._rotation.x, //amount to rotate in radians
                [0,0,1]); // rotate around which axis
            mat4.rotate(
                CameraMatrix,
                CameraMatrix,
                1/180 * this.camera.transform._rotation.y, //amount to rotate in radians
                [0,1,0]); // rotate around which axis
            mat4.rotate(
                CameraMatrix,
                CameraMatrix,
                1/180 * this.camera.transform._rotation.x, //amount to rotate in radians
                [1,0,0]); // rotate around which axis

            const viewMatrix = mat4.create();
            mat4.invert(viewMatrix, CameraMatrix);
            mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
        }else{
            mat4.copy(viewProjectionMatrix,projectionMatrix);
        }
    
         //Set up postion trasnsfer
         {
             const numComponents =3;
             const type =gl.FLOAT;
             const normalize = false;
             const stride = 0;
             const offset = 0;
     
             gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
             gl.vertexAttribPointer(
                 programInfo.attribLocations.vertextPosition,
                 numComponents,
                 type,
                 normalize,
                 stride,
                 offset
             );
     
             gl.enableVertexAttribArray(
                 programInfo.attribLocations.vertextPosition
             );
         }    
     
         //tell vertex shader how to pull color from colors buffer 
         {
             const numberComponents = 4; // how many values per variable,
             const type = gl.FLOAT; //Type of the values sent
             const normalize =false; //Do not normalize the vector,
             const stride =0;
             const offset =0;
     
             gl.bindBuffer(gl.ARRAY_BUFFER,buffers.color); //add a buffer  of a type Array Buffer
             gl.vertexAttribPointer(
                 programInfo.attribLocations.vertextColor, //id of the attibute in the gpu
                 numberComponents, //number of components per attribute
                 type, // type of each component per attribute
                 normalize,
                 stride,
                 offset
             )
             gl.enableVertexAttribArray(
                 programInfo.attribLocations.vertextColor
             );
         }

         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffers.indices);
         {
             const numberComponents =3;
             const type = gl.FLOAT;
             const normalize = false;
             const stride =0;
             const offset =0;
     
             gl.bindBuffer(gl.ARRAY_BUFFER,buffers.normal);
             gl.vertexAttribPointer(
                 programInfo.attribLocations.vertexNormals,
                 numberComponents,
                 type,
                 normalize,
                 stride,
                 offset)
             gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormals);
         }
     
         gl.useProgram(programInfo.program);

         //Set a projectionMatrix
         gl.uniformMatrix4fv(
             programInfo.uniformLocations.projectionMatrix,
             false,
             projectionMatrix);
         // set model matrix
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.uModelViewMatrix,
            false,
            modelMatrix);
        
        //Set viewProjectionMatrix
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.uViewProjectionMatrix,
            false,
            viewProjectionMatrix);

         const normalMatrix =mat4.create();
         mat4.invert(normalMatrix,modelMatrix);
         mat4.transpose(normalMatrix,normalMatrix);
         
         //set noraml Matrix
         gl.uniformMatrix4fv(
             programInfo.uniformLocations.uNormalMatrix,
             false,
             normalMatrix
         );  
         {
            const vertexCount = buffers.lengthOfIndices;
            const type = gl.UNSIGNED_SHORT;
            const offset =0;
            gl.drawElements(gl.TRIANGLES,vertexCount,type,offset);
         }
    }

    InitShaderProgram(gl, vertexShader, fragmentShader){
        const vxShader = this.loadShader(gl,gl.VERTEX_SHADER,vertexShader);
        const fsSource = this.loadShader(gl, gl.FRAGMENT_SHADER,fragmentShader);

        
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram,vxShader);
        gl.attachShader(shaderProgram,fsSource);
        gl.linkProgram(shaderProgram);


        if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){
            console.error("unable to initialize shader program: " + gl.getProgramInfoLog(shaderProgram));
            return null;
        }
        return shaderProgram;
    }


    //Compiles the shader 
    loadShader(gl, type, source){
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.error("An error occured when compiling the shader " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
}

