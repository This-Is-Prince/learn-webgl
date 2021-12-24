attribute vec2 a_position;


uniform vec2 u_resolution;

void main(){
    // convert a_position to zero to one
    vec2 zeroToOne = a_position / u_resolution;
    // convert zeroToOne to zero to two
    vec2 zeroToTwo = zeroToOne * 2.0;
    // convert zeroToTwo to clipSpace
    vec2 clipSpace = zeroToTwo - 1.0;

    // Assigning clipSpace to gl_Position;
    gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
}