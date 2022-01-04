attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;

uniform mat4 u_ProjectionMatrix;
uniform mat4 u_NormalMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;


varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;

void main(){
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;

    v_Position = vec3(u_ModelMatrix * a_Position);
    v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
    v_Color = a_Color;
}