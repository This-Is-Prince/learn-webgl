// MultiAttributeSize

// attribute vec4 a_Position;
// attribute float a_PointSize;


// void main(){
//     gl_Position = a_Position;
//     gl_PointSize = a_PointSize;
// }

// MultiAttributeSize_Interleaved;

// attribute vec4 a_Position;
// attribute float a_PointSize;

// void main(){
//     gl_Position = a_Position;
//     gl_PointSize = a_PointSize;
// }

// MultiAttributeColor

attribute vec4 a_Position;
attribute vec4 a_Color;

varying vec4 v_Color;

void main(){
    gl_Position = a_Position;
    
    v_Color = a_Color;
}