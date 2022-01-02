uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec4 a_Position;
attribute vec4 a_Color;

varying vec4 v_Color;

void main(){
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * a_Position;

    v_Color = a_Color;
}