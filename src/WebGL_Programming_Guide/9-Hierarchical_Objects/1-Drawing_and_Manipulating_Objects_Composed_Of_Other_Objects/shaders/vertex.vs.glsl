attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;

uniform mat4 u_ProjectionMatrix;
uniform mat4 u_NormalMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;

uniform vec3 u_AmbientLightColor;
uniform vec3 u_PointLightPosition;
uniform vec3 u_PointLightColor;

varying vec4 v_Color;

void main(){
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;

    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
    vec4 vertexPosition = u_ModelMatrix * a_Position;
    vec3 light = normalize(u_PointLightPosition - vec3(vertexPosition));
    float nDotL = max(dot(light, normal), 0.0);
    vec3 diffuse = u_PointLightColor * a_Color.rgb * nDotL;
    vec3 ambient = u_AmbientLightColor * a_Color.rgb;

    v_Color = vec4(diffuse + ambient, a_Color.a);
}