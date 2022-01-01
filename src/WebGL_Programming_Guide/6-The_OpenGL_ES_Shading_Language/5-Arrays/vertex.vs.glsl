void main(){
    float floatArray[4];
    vec4 vec4Array[2];

    // int size = 4;
    // vec4 vec4Array[size]; // array size must be a constant integer expression
    // const int size = 4;
    // vec4 vec4Array[size];

    // const vec2 arr[4]; // variables with qualifier 'const' must be initialized

    // float f = floatArray[2];
    // vec4Array[0] = vec4(4.0, 3.0, 6.0, 1.0);
    // vec4Array[1] = vec4(3.0, 2.0, 0.0, 1.0);

    float f = floatArray[1] * 3.14;
    vec4 v4 = vec4Array[0] * vec4(1.0, 2.0, 3.0, 4.0);
}