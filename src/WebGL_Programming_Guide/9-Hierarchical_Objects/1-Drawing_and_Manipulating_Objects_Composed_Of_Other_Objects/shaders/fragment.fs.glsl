precision mediump float;

uniform vec3 u_AmbientLightColor;
uniform vec3 u_PointLightPosition;
uniform vec3 u_PointLightColor;

varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;

void main(){
    vec3 normal = normalize(v_Normal);
    vec3 light = normalize(u_PointLightPosition - v_Position);
    float nDotL = max(dot(light, normal), 0.0);

    vec3 diffuse = u_PointLightColor * v_Color.rgb * nDotL;
    vec3 ambient = u_AmbientLightColor * v_Color.rgb;
    gl_FragColor = vec4(diffuse + ambient, v_Color.a);
}