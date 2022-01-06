attribute vec4 position;
attribute vec4 normal;

uniform mat4 perspectiveMatrix;
uniform mat4 normalMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

varying vec4 v_Color;
varying vec3 v_Position;
varying vec3 v_Normal;

void main(){
    gl_Position = perspectiveMatrix * viewMatrix * modelMatrix * position;

    v_Position = vec3(modelMatrix * position);
    v_Normal = normalize(vec3(normalMatrix * normal));

    v_Color = vec4(1.0, 0.0, 0.0, 1.0);
}

