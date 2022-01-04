attribute vec4 a_Position;
attribute vec4 a_Normal;
attribute vec4 a_Color;

uniform mat4 u_ProjectionMatrix;
uniform mat4 u_NormalMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;

uniform vec3 u_PointLightVector;
uniform vec3 u_AmbientLightColor;
uniform vec3 u_PointLightColor;


varying vec4 v_Color;

void main(){
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;

    vec3 normalVector = normalize(vec3(u_NormalMatrix * a_Normal));

    float nDotL = max(dot(u_PointLightVector, normalVector), 0.0);

    vec3 diffuse = u_PointLightColor * a_Color.rgb * nDotL;

    vec3 ambient = u_PointLightColor * a_Color.rgb;

    v_Color = vec4(diffuse + ambient, a_Color.a);
}