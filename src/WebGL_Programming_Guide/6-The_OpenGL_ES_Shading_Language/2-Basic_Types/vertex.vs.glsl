void main(){
    float floatVar;
    int intVar;
    bool boolVar;

    // int i = 8; // OK
    // float f1 = 8; // Error
    // float f2 = 8.0; // OK
    // float f3 = 8.0f; // Error: Expressions like 8.0f used in C are not allowed.

    int i = 8;
    float f1 = float(i);
    float f2 = float(8);
}