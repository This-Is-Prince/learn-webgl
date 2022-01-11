#version 300 es

in vec4 a_position;

uniform float uPointSize;
uniform float uAngle;

void main(void){
    gl_Position = vec4(
        a_position.x + cos(uAngle) * 0.8 ,
        a_position.y + sin(uAngle) * 0.8 , 
        a_position.z, 1.0
    );
    gl_PointSize = uPointSize;
}