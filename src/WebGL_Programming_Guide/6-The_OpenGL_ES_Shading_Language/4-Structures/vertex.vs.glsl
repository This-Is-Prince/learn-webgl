
struct light{
    vec4 color;
    vec3 position;
} l3;
light l1,l2;

void main(){
  float a = l3.color.x;
  light l4 = light(vec4(1.0),vec3(2.0));
  vec4 color = l1.color;
  vec3 position = l1.position;
}