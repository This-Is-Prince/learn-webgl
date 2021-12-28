attribute vec4 a_Position;

uniform float a_PointSize;


void main(){
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
}