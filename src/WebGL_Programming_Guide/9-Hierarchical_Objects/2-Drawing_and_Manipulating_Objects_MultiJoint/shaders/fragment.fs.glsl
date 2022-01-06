precision mediump float;


varying vec3 v_Position;
varying vec3 v_Normal;
varying vec4 v_Color;

void main(){
    vec3 u_AmbientLightColor = vec3(0.2, 0.2, 0.2);
    vec3 u_PointLightColor= vec3(1.0, 1.0, 1.0);
    vec3 u_PointLightPosition = vec3(0.0, 0.0, 7.0);

    vec3 normal = normalize(v_Normal);
    vec3 light = normalize(u_PointLightPosition - v_Position);
    float nDotL = max(dot(light, normal), 0.0);

    vec3 diffuse = u_PointLightColor * v_Color.rgb * nDotL;
    vec3 ambient = u_AmbientLightColor * v_Color.rgb;
    gl_FragColor = vec4(diffuse + ambient, v_Color.a);
}