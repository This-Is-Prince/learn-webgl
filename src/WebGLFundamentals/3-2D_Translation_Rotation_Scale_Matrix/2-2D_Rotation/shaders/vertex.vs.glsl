attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;

void main(){
    // Rotate the Position
    vec2 rotatedPosition = vec2(
        a_position.x * u_rotation.y + a_position.y * u_rotation.x,
        a_position.y * u_rotation.y - a_position.x * u_rotation.x
    );
    
    // Translate the Position
    vec2 position = rotatedPosition + u_translation;

    // ClipSpace
    vec2 zeroToOne = position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
}