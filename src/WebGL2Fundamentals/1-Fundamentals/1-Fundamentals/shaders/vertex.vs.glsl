#version 300 es

in vec4 a_position;
uniform vec2 u_resolution;

void main(){
    gl_Position = vec4(a_position.xy / u_resolution, a_position.zw);
}