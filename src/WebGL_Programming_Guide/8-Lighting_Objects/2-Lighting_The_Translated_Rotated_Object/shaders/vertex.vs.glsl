attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;

uniform mat4 u_ModelMatrix;
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ViewMatrix;
uniform vec3 u_AmbientLightColor;
uniform vec3 u_DirectionalLightColor;
uniform vec3 u_DirectionalLightDirection;

varying vec4 v_Color;

void main(){
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;

    vec3 normal = normalize(vec3(a_Normal));
    float nDotL = max(dot(u_DirectionalLightDirection, normal), 0.0);

    vec3 diffuse = u_DirectionalLightColor * vec3(a_Color) * nDotL;
    vec3 ambient = u_AmbientLightColor * a_Color.rgb;

    v_Color = vec4(diffuse + ambient, a_Color.a);
}
