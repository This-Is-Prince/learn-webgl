uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

attribute vec4 a_position;
attribute vec4 a_color;

varying vec4 v_color;

void main(){
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * a_position;
    v_color = a_color;
}