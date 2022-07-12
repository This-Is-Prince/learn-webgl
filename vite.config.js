const { resolve } = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        Fun_With_WebGL_2: resolve(__dirname, "src/Fun_With_WebGL_2.0/index.html"),
        "Fun_With_WebGL_2.0/Lesson_001": resolve(__dirname, "src/Fun_With_WebGL_2.0/Lesson_001/index.html"),
        "Fun_With_WebGL_2.0/Lesson_001/Revised_01": resolve(__dirname, "src/Fun_With_WebGL_2.0/Lesson_001/Revised_01/index.html"),
        "Fun_With_WebGL_2.0/Lesson_001/Revised_02": resolve(__dirname, "src/Fun_With_WebGL_2.0/Lesson_001/Revised_02/index.html"),

        "Fun_With_WebGL_2.0/Lesson_002": resolve(__dirname, "src/Fun_With_WebGL_2.0/Lesson_002/index.html"),
        "Fun_With_WebGL_2.0/Lesson_003": resolve(__dirname, "src/Fun_With_WebGL_2.0/Lesson_003/index.html"),
        "Fun_With_WebGL_2.0/Lesson_004": resolve(__dirname, "src/Fun_With_WebGL_2.0/Lesson_004/index.html"),
        "Fun_With_WebGL_2.0/Lesson_005": resolve(__dirname, "src/Fun_With_WebGL_2.0/Lesson_005/index.html"),
        "Fun_With_WebGL_2.0/Lesson_006": resolve(__dirname, "src/Fun_With_WebGL_2.0/Lesson_006/index.html"),
        "Fun_With_WebGL_2.0/Lesson_007": resolve(__dirname, "src/Fun_With_WebGL_2.0/Lesson_007/index.html"),

        WebGL_Programming_Guide: resolve(__dirname, "src/WebGL_Programming_Guide/index.html"),
        "WebGL_Programming_Guide/2-Your_First_Step_With_WebGL": resolve(__dirname, "src/WebGL_Programming_Guide/2-Your_First_Step_With_WebGL/index.html"),
        "WebGL_Programming_Guide/2-Your_First_Step_With_WebGL/1-What_Is_A_Canvas": resolve(__dirname, "src/WebGL_Programming_Guide/2-Your_First_Step_With_WebGL/1-What_Is_A_Canvas/index.html"),
        "WebGL_Programming_Guide/2-Your_First_Step_With_WebGL/2-The_World_Shortest_WebGL_Program": resolve(__dirname, "src/WebGL_Programming_Guide/2-Your_First_Step_With_WebGL/2-The_World_Shortest_WebGL_Program/index.html"),
        "WebGL_Programming_Guide/2-Your_First_Step_With_WebGL/3-Draw_A_Point_Version-1": resolve(__dirname, "src/WebGL_Programming_Guide/2-Your_First_Step_With_WebGL/3-Draw_A_Point_Version-1/index.html"),
        "WebGL_Programming_Guide/2-Your_First_Step_With_WebGL/4-Draw_A_Point_Version-2": resolve(__dirname, "src/WebGL_Programming_Guide/2-Your_First_Step_With_WebGL/4-Draw_A_Point_Version-2/index.html"),
        "WebGL_Programming_Guide/2-Your_First_Step_With_WebGL/5-Draw_A_Point_With_a_Mouse_Click": resolve(__dirname, "src/WebGL_Programming_Guide/2-Your_First_Step_With_WebGL/5-Draw_A_Point_With_a_Mouse_Click/index.html"),
        "WebGL_Programming_Guide/2-Your_First_Step_With_WebGL/6-Change_The_Point_Color": resolve(__dirname, "src/WebGL_Programming_Guide/2-Your_First_Step_With_WebGL/6-Change_The_Point_Color/index.html"),

        "WebGL_Programming_Guide/3-Drawing_And_Transforming_Triangles": resolve(__dirname, "src/WebGL_Programming_Guide/3-Drawing_And_Transforming_Triangles/index.html"),
        "WebGL_Programming_Guide/3-Drawing_And_Transforming_Triangles/1-Drawing_Multiple_Points": resolve(__dirname, "src/WebGL_Programming_Guide/3-Drawing_And_Transforming_Triangles/1-Drawing_Multiple_Points/index.html"),
        "WebGL_Programming_Guide/3-Drawing_And_Transforming_Triangles/2-Hello_Triangle": resolve(__dirname, "src/WebGL_Programming_Guide/3-Drawing_And_Transforming_Triangles/2-Hello_Triangle/index.html"),
        "WebGL_Programming_Guide/3-Drawing_And_Transforming_Triangles/3-Moving_Rotating_Scaling": resolve(__dirname, "src/WebGL_Programming_Guide/3-Drawing_And_Transforming_Triangles/3-Moving_Rotating_Scaling/index.html"),
        
        "WebGL_Programming_Guide/4-More_Transformations_And_Basic_Animation": resolve(__dirname, "src/WebGL_Programming_Guide/4-More_Transformations_And_Basic_Animation/index.html"),
        "WebGL_Programming_Guide/4-More_Transformations_And_Basic_Animation/1-Translate_And_Then_Rotate": resolve(__dirname, "src/WebGL_Programming_Guide/4-More_Transformations_And_Basic_Animation/1-Translate_And_Then_Rotate/index.html"),
        "WebGL_Programming_Guide/4-More_Transformations_And_Basic_Animation/2-Animation": resolve(__dirname, "src/WebGL_Programming_Guide/4-More_Transformations_And_Basic_Animation/2-Animation/index.html"),
        
        "WebGL_Programming_Guide/5-Using_Colors_and_Texture_Images": resolve(__dirname, "src/WebGL_Programming_Guide/5-Using_Colors_and_Texture_Images/index.html"),
        "WebGL_Programming_Guide/5-Using_Colors_and_Texture_Images/1-Passing_Other_Types_of_Information_to_Vertex_Shaders": resolve(__dirname, "src/WebGL_Programming_Guide/5-Using_Colors_and_Texture_Images/1-Passing_Other_Types_of_Information_to_Vertex_Shaders/index.html"),
        "WebGL_Programming_Guide/5-Using_Colors_and_Texture_Images/2-Color_Triangle": resolve(__dirname, "src/WebGL_Programming_Guide/5-Using_Colors_and_Texture_Images/2-Color_Triangle/index.html"),
        "WebGL_Programming_Guide/5-Using_Colors_and_Texture_Images/3-Pasting_an_Image_onto_a_Rectangle": resolve(__dirname, "src/WebGL_Programming_Guide/5-Using_Colors_and_Texture_Images/3-Pasting_an_Image_onto_a_Rectangle/index.html"),

        "WebGL_Programming_Guide/6-The_OpenGL_ES_Shading_Language": resolve(__dirname, "src/WebGL_Programming_Guide/6-The_OpenGL_ES_Shading_Language/index.html"),
        "WebGL_Programming_Guide/6-The_OpenGL_ES_Shading_Language/1-Hello_Shader!": resolve(__dirname, "src/WebGL_Programming_Guide/6-The_OpenGL_ES_Shading_Language/1-Hello_Shader!/index.html"),

        "WebGL_Programming_Guide/7-Toward_The_3D_World": resolve(__dirname, "src/WebGL_Programming_Guide/7-Toward_The_3D_World/index.html"),
        "WebGL_Programming_Guide/7-Toward_The_3D_World/1-Specifying_The_Viewing_Direction": resolve(__dirname, "src/WebGL_Programming_Guide/7-Toward_The_3D_World/1-Specifying_The_Viewing_Direction/index.html"),
        "WebGL_Programming_Guide/7-Toward_The_3D_World/2-Specifying_The_Visible_Range_(Box_Type)": resolve(__dirname, "src/WebGL_Programming_Guide/7-Toward_The_3D_World/2-Specifying_The_Visible_Range_(Box_Type)/index.html"),
        "WebGL_Programming_Guide/7-Toward_The_3D_World/3-Specifying_The_Visible_Range_Using_A_Quadrangular_Pyramid": resolve(__dirname, "src/WebGL_Programming_Guide/7-Toward_The_3D_World/3-Specifying_The_Visible_Range_Using_A_Quadrangular_Pyramid/index.html"),
        "WebGL_Programming_Guide/7-Toward_The_3D_World/4-Correctly_Handling_Foreground_and_Background_Objects": resolve(__dirname, "src/WebGL_Programming_Guide/7-Toward_The_3D_World/4-Correctly_Handling_Foreground_and_Background_Objects/index.html"),
        "WebGL_Programming_Guide/7-Toward_The_3D_World/5-Hello_Cube": resolve(__dirname, "src/WebGL_Programming_Guide/7-Toward_The_3D_World/5-Hello_Cube/index.html"),

        "WebGL_Programming_Guide/8-Lighting_Objects": resolve(__dirname, "src/WebGL_Programming_Guide/8-Lighting_Objects/index.html"),
        "WebGL_Programming_Guide/8-Lighting_Objects/1-Lighting_3D_Objects": resolve(__dirname, "src/WebGL_Programming_Guide/8-Lighting_Objects/1-Lighting_3D_Objects/index.html"),
        "WebGL_Programming_Guide/8-Lighting_Objects/2-Lighting_The_Translated_Rotated_Object": resolve(__dirname, "src/WebGL_Programming_Guide/8-Lighting_Objects/2-Lighting_The_Translated_Rotated_Object/index.html"),
        "WebGL_Programming_Guide/8-Lighting_Objects/3-Using_A_Point_Light_Object": resolve(__dirname, "src/WebGL_Programming_Guide/8-Lighting_Objects/3-Using_A_Point_Light_Object/index.html"),
        "WebGL_Programming_Guide/8-Lighting_Objects/4-Using_A_Point_Light_Object": resolve(__dirname, "src/WebGL_Programming_Guide/8-Lighting_Objects/4-Using_A_Point_Light_Object/index.html"),

        "WebGL_Programming_Guide/9-Hierarchical_Objects": resolve(__dirname, "src/WebGL_Programming_Guide/9-Hierarchical_Objects/index.html"),
        "WebGL_Programming_Guide/9-Hierarchical_Objects/1-Drawing_and_Manipulating_Objects_Composed_Of_Other_Objects": resolve(__dirname, "src/WebGL_Programming_Guide/9-Hierarchical_Objects/1-Drawing_and_Manipulating_Objects_Composed_Of_Other_Objects/index.html"),
        "WebGL_Programming_Guide/9-Hierarchical_Objects/2-Drawing_and_Manipulating_Objects_MultiJoint": resolve(__dirname, "src/WebGL_Programming_Guide/9-Hierarchical_Objects/2-Drawing_and_Manipulating_Objects_MultiJoint/index.html"),

        WebGL_Programming_Guide_2: resolve(__dirname, "src/WebGL_Programming_Guide-2/index.html"),

        "WebGL_Programming_Guide-2/1-Drawing_Triangle": resolve(__dirname, "src/WebGL_Programming_Guide-2/1-Drawing_Triangle/index.html"),
        "WebGL_Programming_Guide-2/2-Hello_Canvas": resolve(__dirname, "src/WebGL_Programming_Guide-2/2-Hello_Canvas/HelloCanvas.html"),
        "WebGL_Programming_Guide-2/3-HelloPoint1": resolve(__dirname, "src/WebGL_Programming_Guide-2/3-HelloPoint1/HelloPoint1.html"),
        "WebGL_Programming_Guide-2/4-HelloPoint2": resolve(__dirname, "src/WebGL_Programming_Guide-2/4-HelloPoint2/HelloPoint2.html"),
        "WebGL_Programming_Guide-2/5-ClickedPoints": resolve(__dirname, "src/WebGL_Programming_Guide-2/5-ClickedPoints/ClickedPoints.html"),
        "WebGL_Programming_Guide-2/6-ColoredPoints": resolve(__dirname, "src/WebGL_Programming_Guide-2/6-ColoredPoints/ColoredPoints.html"),
        "WebGL_Programming_Guide-2/7-MultiPoint": resolve(__dirname, "src/WebGL_Programming_Guide-2/7-MultiPoint/MultiPoint.html"),
        "WebGL_Programming_Guide-2/8-HelloTriangle": resolve(__dirname, "src/WebGL_Programming_Guide-2/8-HelloTriangle/HelloTriangle.html"),
        "WebGL_Programming_Guide-2/9-HelloQuad": resolve(__dirname, "src/WebGL_Programming_Guide-2/9-HelloQuad/HelloQuad.html"),
        "WebGL_Programming_Guide-2/10-TranslatedTriangle": resolve(__dirname, "src/WebGL_Programming_Guide-2/10-TranslatedTriangle/TranslatedTriangle.html"),
        "WebGL_Programming_Guide-2/11-RotatedTriangle": resolve(__dirname, "src/WebGL_Programming_Guide-2/11-RotatedTriangle/RotatedTriangle.html"),
        "WebGL_Programming_Guide-2/12-RotatedTriangle_Matrix": resolve(__dirname, "src/WebGL_Programming_Guide-2/12-RotatedTriangle_Matrix/RotatedTriangle_Matrix.html"),
        "WebGL_Programming_Guide-2/13-RotatedTriangle_Matrix4": resolve(__dirname, "src/WebGL_Programming_Guide-2/13-RotatedTriangle_Matrix4/RotatedTriangle_Matrix4.html"),
        "WebGL_Programming_Guide-2/14-RotatedTranslatedTriangle": resolve(__dirname, "src/WebGL_Programming_Guide-2/14-RotatedTranslatedTriangle/RotatedTranslatedTriangle.html"),
        "WebGL_Programming_Guide-2/15-RotatingTriangle": resolve(__dirname, "src/WebGL_Programming_Guide-2/15-RotatingTriangle/RotatingTriangle.html"),

        WebGL_Up_and_Running: resolve(__dirname, "src/WebGL_Up_and_Running/index.html"),

        WebGL2Fundamentals: resolve(__dirname, "src/WebGL2Fundamentals/index.html"),
        "WebGL2Fundamentals/1-Fundamentals": resolve(__dirname, "src/WebGL2Fundamentals/1-Fundamentals/index.html"),
        "WebGL2Fundamentals/1-Fundamentals/1-Fundamentals": resolve(__dirname, "src/WebGL2Fundamentals/1-Fundamentals/1-Fundamentals/index.html"),
        "WebGL2Fundamentals/3-2D_Translation_rotation_scale_matrix": resolve(__dirname, "src/WebGL2Fundamentals/3-2D_Translation_rotation_scale_matrix/index.html"),
        "WebGL2Fundamentals/3-2D_Translation_rotation_scale_matrix/1-2D_Translation": resolve(__dirname, "src/WebGL2Fundamentals/3-2D_Translation_rotation_scale_matrix/1-2D_Translation/index.html"),

        WebGLFundamentals: resolve(__dirname, "src/WebGLFundamentals/index.html"),
        "WebGLFundamentals/0-Helpers": resolve(__dirname, "src/WebGLFundamentals/0-Helpers/index.html"),
        "WebGLFundamentals/1-Fundamentals/1-Fundamentals": resolve(__dirname, "src/WebGLFundamentals/1-Fundamentals/1-Fundamentals/index.html"),
        "WebGLFundamentals/1-Fundamentals/2-How_It_Works": resolve(__dirname, "src/WebGLFundamentals/1-Fundamentals/2-How_It_Works/index.html"),
        "WebGLFundamentals/2-Image_Processing": resolve(__dirname, "src/WebGLFundamentals/2-Image_Processing/1-Image_Processing/index.html"),
        "WebGLFundamentals/3-2D_Translation_Rotation_Scale_Matrix/1-2D_Translation": resolve(__dirname, "src/WebGLFundamentals/3-2D_Translation_Rotation_Scale_Matrix/1-2D_Translation/index.html"),
        "WebGLFundamentals/3-2D_Translation_Rotation_Scale_Matrix/2-2D_Rotation": resolve(__dirname, "src/WebGLFundamentals/3-2D_Translation_Rotation_Scale_Matrix/2-2D_Rotation/index.html"),
        "WebGLFundamentals/3-2D_Translation_Rotation_Scale_Matrix/3-2D_Scale": resolve(__dirname, "src/WebGLFundamentals/3-2D_Translation_Rotation_Scale_Matrix/3-2D_Scale/index.html"),
        "WebGLFundamentals/3-2D_Translation_Rotation_Scale_Matrix/4-2D_Matrices": resolve(__dirname, "src/WebGLFundamentals/3-2D_Translation_Rotation_Scale_Matrix/4-2D_Matrices/index.html"),
        "WebGLFundamentals/4-3D/1-Orthographic_3D": resolve(__dirname, "src/WebGLFundamentals/4-3D/1-Orthographic_3D/index.html"),
        "WebGLFundamentals/4-3D/2-3D_Perspective": resolve(__dirname, "src/WebGLFundamentals/4-3D/2-3D_Perspective/index.html"),
        "WebGLFundamentals/4-3D/3-3D_Camera": resolve(__dirname, "src/WebGLFundamentals/4-3D/3-3D_Camera/index.html"),
      },
    },
  },
});