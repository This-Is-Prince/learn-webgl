attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;

uniform mat4 u_ViewMatrix;
uniform mat4 u_MVPMatrix;
uniform mat4 u_ProjectionMatrix;

uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;

varying vec4 v_Color;

void main(){
    // gl_Position = u_ProjectionMatrix * u_ViewMatrix * a_Position;
    gl_Position = u_MVPMatrix * a_Position;

    vec3 normal = normalize(vec3(a_Normal));
    float nDotL = max(dot(u_LightDirection, normal), 0.0);

    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;

    v_Color = vec4(diffuse, a_Color.a);
}