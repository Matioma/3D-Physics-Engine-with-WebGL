window.onload = main;

const vsSource =`
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(){
        gl_Position = uProjectionMatrix * uModelViewMatrix* aVertexPosition;
        vColor = aVertexColor;
    }
`;
const fsSource =`
    varying lowp vec4 vColor;

    void main(){
        gl_FragColor = vColor;
    }
`;

function main(){
    let canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");

    if(gl === null){
        alert("The browser does not support WebGL")
        return;
    }
    
    const shaderProgram =initShaderProgram(gl,vsSource,fsSource);


    const programInfo ={
        program: shaderProgram,
        attribLocations: {
            vertextPosition: gl.getAttribLocation(shaderProgram,"aVertexPosition"),
            vertextColor: gl.getAttribLocation(shaderProgram,"aVertexColor")
        },
        uniformLocations:{
            projectionMatrix: gl.getUniformLocation(shaderProgram,"uProjectionMatrix"),
            uModelViewMatrix: gl.getUniformLocation(shaderProgram,"uModelViewMatrix")
        },
    };

    const buffers =  initBuffers(gl);
    drawScene(gl,programInfo, buffers);

}


/*
    Initialize Shader program
*/
function initShaderProgram(gl, vsSource, fsSource){
    const vertexShader = loadShader(gl,gl.VERTEX_SHADER,vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER,fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram,vertexShader);
    gl.attachShader(shaderProgram,fragmentShader);
    gl.linkProgram(shaderProgram);   

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        alert("unable to initlize shader program: " +gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}


function loadShader(gl, type, source){
    const shader = gl.createShader(type);
    
    gl.shaderSource(shader,source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
        alert("An error occured when compiling the shader " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function initBuffers(gl){
    const positionBuffer = gl.createBuffer();   

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        -1.0,  1.0, 0.5, 1,
         1.0,  1.0, 1.0, 1,
        -1.0, -1.0, -0.5, 1,
         1.0, -1.0, -0.1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const colorBuffer =gl.createBuffer();
    const colors = [
        1.0,1.0,1.0,1.0,
        1.0,0.0,0.0,1.0,
        0.0,1.0,0.0,1.0,
        0.0,0.0,1.0,1.0,
    ]
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colorBuffer),gl.STATIC_DRAW);

    return{
        position:positionBuffer,
        color:colorBuffer
    };
}

function drawScene(gl,programInfo,buffers){
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
        [-0.0,0.0, -3]);

   
    //Set up 
    {
        const numComponents =4;
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
        const numberOfComponent = 4; // how many values per variable,
        const type = gl.FLOAT; //Type of the values sent
        const normalize =false; //Do not normalize the vector,
        const stride =0;
        const offset =0;

        gl.bindBuffer(gl.ARRAY_BUFFER,buffers.color); //add a buffer  of a type Array Buffer
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertextColor, //id of the attibute in the gpu
            numberOfComponent, //number of components per attribute
            type, // type of each component per attribute
            normalize,
            stride,
            offset
        )
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertextColor
        );
    }

    gl.useProgram(programInfo.program);

    //Set a uniform matrix
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.uModelViewMatrix,
        false,
        modelMatrix);

    {
        const offset =0;
        const vertexCount =4;
        gl.drawArrays(gl.TRIANGLE_STRIP,offset,vertexCount); 
    }
   
}
