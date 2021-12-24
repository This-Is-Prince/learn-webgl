attribute vec2 a_position;


uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;

void main(){
    // Scale the Position
    vec2 scaledPosition = a_position * u_scale;

    // Rotate the Position
    vec2 rotatedPosition = vec2(
    scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
    scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x
    );
    vec2 position = rotatedPosition + u_translation;
    // convert a_position to zero to one
    vec2 zeroToOne = position / u_resolution;
    // convert zeroToOne to zero to two
    vec2 zeroToTwo = zeroToOne * 2.0;
    // convert zeroToTwo to clipSpace
    vec2 clipSpace = zeroToTwo - 1.0;

    // Assigning clipSpace to gl_Position;
    gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
}