export const vsSource =`
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec4 aVertexNormal;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uNormalMatrix;

    varying lowp vec4 vColor;
    varying highp vec3 vLighting;

    void main(){
        gl_Position = uProjectionMatrix * uModelViewMatrix* aVertexPosition;
        vColor = aVertexColor;


        highp vec3 ambientLight =vec3(0.3,0.3,0.3);
        highp vec3 directionLightColor = vec3(1.0,1.0,1.0);
        highp vec3 directionalVector =normalize(vec3(0.85,0.8,0.75));

        highp vec4 transformedNormal = uNormalMatrix * aVertexNormal;

        highp float directional  = max(dot(transformedNormal.xyz,directionalVector),0.0);
        vLighting = ambientLight + (directionLightColor * directional);
    }
`;