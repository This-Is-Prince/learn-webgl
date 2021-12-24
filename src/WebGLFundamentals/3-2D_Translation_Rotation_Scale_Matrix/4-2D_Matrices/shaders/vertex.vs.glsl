attribute vec2 a_position;

uniform vec2 u_resolution;
uniform mat3 u_matrix;

void main(){
    vec2 position = (u_matrix * vec3(a_position, 1.0)).xy;
    // convert a_position to zero to one
    vec2 zeroToOne = position / u_resolution;
    // convert zeroToOne to zero to two
    vec2 zeroToTwo = zeroToOne * 2.0;
    // convert zeroToTwo to clipSpace
    vec2 clipSpace = zeroToTwo - 1.0;

    // Assigning clipSpace to gl_Position;
    gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
}