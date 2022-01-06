attribute vec4 position;
attribute vec4 normal;

uniform mat4 perspectiveMatrix;
uniform mat4 normalMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

varying vec4 v_Color;

void main(){
    gl_Position = perspectiveMatrix * viewMatrix * modelMatrix * position;
    vec4 color = vec4(1.0, 0.0, 0.0, 1.0);
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 ambientColor = vec3(0.2, 0.2, 0.2);

    vec3 normalVec = normalize(vec3(normalMatrix * normal));
    vec3 lightVec = normalize(vec3(0.5, 3.0, 4.0) - vec3(modelMatrix * position));

    float nDotL = max(dot(normalVec, lightVec), 0.0);

    vec3 diffuse = lightColor * color.rgb * nDotL;

    vec3 ambient = ambientColor * color.rgb;

    v_Color = vec4(diffuse + ambient , color.a);
}

