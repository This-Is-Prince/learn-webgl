void main(){
    /* 
      Vector
     */
    // vec4 position = 1.0; // Error
    // vec4 position = vec4(1.0);
    // vec4 position = vec4(1.0,2.0,3.0,4.0);
    // vec3 v3 = vec3(1.0, 2.0, 3.0);
    // vec2 v2 = vec2(v3);
    // vec4 v4 = vec4(1.0);
    // vec4 v4b = vec4(v2, v4);

    /* 
       Matrix
     */
    //  mat4 m4 = mat4(             
    //      1.0, 2.0, 3.0, 4.0,      // [1.0, 5.0, 9.0, 13.0]
    //      5.0, 6.0, 7.0, 8.0,      // [2.0, 6.0, 10.0, 14.0]
    //      9.0, 10.0, 11.0, 12.0,   // [3.0, 7.0, 11.0, 15.0]
    //      13.0, 14.0, 15.0, 16.0   // [4.0, 8.0, 12.0, 16.0]
    //  );

    //  vec2 v2_1 = vec2(1.0, 3.0);
    //  vec2 v2_2 = vec2(2.0, 4.0);
    //  mat2 m2_1 = mat2(v2_1, v2_2); 
     /* 
       [1.0, 2.0]
       [3.0, 4.0]
      */
    //   vec4 v4 = vec4(1.0, 3.0, 2.0, 4.0);
    //   mat2 m2_2 = mat2(v4);
      /* 
        [1.0, 2.0]
        [3.0, 4.0]
       */

    // mat2 m2 = mat2(1.0, 3.0, v2_2);
    /* 
       [1.0, 2.0]
       [3.0, 4.0]
     */
    // mat4 m4 = mat4(1.0);
    /* 
      [1.0, 0.0, 0.0, 0.0]
      [0.0, 1.0, 0.0, 0.0]
      [0.0, 0.0, 1.0, 0.0]
      [0.0, 0.0, 0.0, 1.0]
     */
    // mat4 mEx = mat4(1.0, 2.0, 3.0); // Error. mat4 requires 16 elemens.


    // vec3 v3 = vec3(1.0, 2.0, 3.0);
    // float f;
    // f = v3.x; // Sets f to 1.0
    // f = v3.y; // Sets f to 2.0
    // f = v3.z; // Sets f to 3.0

    // f = v3.r; // Sets f to 1.0
    // f = v3.s; // Sets f to 1.0
    // // f = v3.w; // Error

    // vec2 v2;
    // v2 = v3.xy; // sets v2 to (1.0, 2.0)
    // v2 = v3.yz; // sets v2 to (2.0, 3.0)
    // v2 = v3.xz; // sets v2 to (1.0, 3.0)
    // v2 = v3.yx; // sets v2 to (2.0, 1.0)
    // v2 = v3.xx; // sets v2 to (1.0, 1.0)

    // vec3 v3a; 
    // v3a = v3.zyx; // sets v3a to (3.0, 2.0, 1.0)

    // vec4 position = vec4(1.0, 2.0, 3.0, 4.0);
    // position.xw = vec2(5.0, 6.0);  // position = (5.0, 2.0, 3.0, 6.0)
    // component names must come from the same set so, for example, v3.was is not allowed

    // position.xa = vec2(5.0, 6.0); // same reason (swizzle selectors not from the same set)

    /* 
       The [] Operator
     */
    mat4 m4 = mat4(
        1.0, 2.0, 3.0, 4.0,
        5.0, 6.0, 7.0, 8.0,
        9.0, 10.0, 11.0, 12.0,
        13.0, 14.0, 15.0, 16.0
    );
    vec4 column_1 = m4[0]; // Retrieve the 1st column from m4: (1.0, 2.0, 3.0, 4.0)
    vec4 column_2 = m4[1];
    vec4 column_3 = m4[2];
    vec4 column_4 = m4[3];

    float m23 = m4[1][2]; // Sets m23 to the third component of the second column of m4 (7.0).
    float m32 = m4[3].y;  // Sets m32 to the second component of the third column of m4 (10.0).
}