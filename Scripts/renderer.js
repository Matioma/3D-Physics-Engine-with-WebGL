import {fsSource} from "./Shaders/fragmentShader.js";
import {vsSource} from "./Shaders/vertexShader.js" 

import Scene from "./scene.js";

export default class Renderer{
    constructor(){
        console.log("Renderer created");
        this.Initialize();
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
                uNormalMatrix: this.gl.getUniformLocation(this.shaderProgram,"uNormalMatrix")
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
        };
        
    }
    
    drawMesh(gl,programInfo,buffers, transform){
         //Projection matrix parameters
         const fieldOfView = 45 *Math.PI/180; 
         const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
         const zNear =0.1;
         const zFar = 100;
     
         //Create projection matrix
         const projectionMatrix = mat4.create();
         mat4.perspective(projectionMatrix,
             fieldOfView,
             aspect,
             zNear,
             zFar);
     

         //Create model matrix
         const modelMatrix = mat4.create();

         console.log();
         mat4.translate(
             modelMatrix,
             modelMatrix,
             transform.position.toArray());
     
         mat4.rotate(
             modelMatrix,
             modelMatrix,
             1/365 * transform._rotation.z, //amount to rotate in radians
             [0,0,1]); // rotate around which axis

        mat4.rotate(
            modelMatrix,
            modelMatrix,
            1/365 * transform._rotation.y, //amount to rotate in radians
            [0,1,0]); // rotate around which axis
        
        mat4.rotate(
            modelMatrix,
            modelMatrix,
            1/365 * transform._rotation.x, //amount to rotate in radians
            [1,0,0]); // rotate around which axis
        
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
             const vertexCount = 36;
             const type = gl.UNSIGNED_SHORT;
             const offset =0;
             gl.drawElements(gl.TRIANGLES,vertexCount,type,offset);
     
             // const offset =0;
             // const vertexCount =4;
             // gl.drawArrays(gl.TRIANGLE_STRIP,offset,vertexCount); 
         }


    }

    initBuffers(gl){
        const positionBuffer = gl.createBuffer();   
        const positions = [
             // Front face
            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
    
             // Back face
            -1.0, -1.0, -1.0,//4
            -1.0,  1.0, -1.0,//5
            1.0,  1.0, -1.0,//6
            1.0, -1.0, -1.0,//7
            
            // Top face
            -1.0,  1.0, -1.0,//8
            -1.0,  1.0,  1.0,//9
            1.0,  1.0,  1.0,//10
            1.0,  1.0, -1.0,//11
            
            // Bottom face
            -1.0, -1.0, -1.0,//12
            1.0, -1.0, -1.0,//13
            1.0, -1.0,  1.0,//14
            -1.0, -1.0,  1.0,//15
            
            // Right face
            1.0, -1.0, -1.0,//16
            1.0,  1.0, -1.0,//17
            1.0,  1.0,  1.0,//18
            1.0, -1.0,  1.0,//19
    
            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
        ];
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        
        const faceColors = [
            [1.0,1.0,1.0,1.0],
            [1.0,0.0,1.0,1.0],
            [1.0,0.0,1.0,1.0],
            [1.0,0.0,1.0,1.0],
            [1.0,0.0,1.0,1.0],
            [1.0,0.0,1.0,1.0]
        ]
    
        var colors = [];
    
        for (var i = 0; i < faceColors.length; ++i) {
            const c = faceColors[i];
    
            // Repeat each color four times for the four vertices of the face
            colors = colors.concat(c, c, c, c);

            
        }
        
        const colorBuffer =gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW);
    
    
        
        const indices =[
            0,1,2,    0,2,3, //front
            4,5,6,    4,6,7, //back
            8,9,10,   8,10,11, //top
            12,13,14, 12,14,15, //bottom
            16,17,18, 16,18,19, //right
            20,21,22, 20,22,23, //left
    
        ];
    
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer);
    
        const vertexNormals =[
            //Front
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
    
             // Back
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
    
              // Top
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
    
            // Bottom
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
    
            // Right
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
    
            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
        ]
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexNormals),gl.STATIC_DRAW);
    
    
        return{
            position:positionBuffer,
            normal:normalBuffer,
            color:colorBuffer,
            indices: indexBuffer,
        };
    }

    drawScene(gl,programInfo,buffers){
        gl.clearColor(0.0,0.0,0.0,1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
    
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    
        //Projection matrix parameters
        const fieldOfView = 45 *Math.PI/180; 
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear =0.1;
        const zFar = 100;
    
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
            [-0.0,0.0, -6]);
    
        mat4.rotate(
            modelMatrix,
            modelMatrix,
            0.7, //amount to rotate in radians
            [0,1,1]); // rotate around which axis
       
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
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset =0;
            gl.drawElements(gl.TRIANGLES,vertexCount,type,offset);
    
            // const offset =0;
            // const vertexCount =4;
            // gl.drawArrays(gl.TRIANGLE_STRIP,offset,vertexCount); 
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

