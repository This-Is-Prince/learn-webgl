attribute vec4 a_Position;

// uniform vec4 u_Translation;
uniform float u_Angle_In_Radian;

void main(){
    // gl_Position = a_Position + u_Translation;
    float c = cos(u_Angle_In_Radian);
    float s = sin(u_Angle_In_Radian);
    gl_Position = vec4(
        c * a_Position.x - s * a_Position.y,
        s * a_Position.x + c * a_Position.y,
        a_Position.z, 
        1.0
    );
}