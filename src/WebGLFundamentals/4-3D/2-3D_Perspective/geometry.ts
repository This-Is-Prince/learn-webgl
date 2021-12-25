type SetFGeometry = (
  gl: WebGLRenderingContext,
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  depth: number,
  thicknessOfRung: number
) => void;

const setFGeometry: SetFGeometry = (
  gl,
  x,
  y,
  z,
  width,
  height,
  depth,
  thicknessOfRung
) => {
  const vertices = [
    // left column front
    [x, y, z],
    [x, y + height, z],
    [x + thicknessOfRung, y, z],
    [x, y + height, z],
    [x + thicknessOfRung, y + height, z],
    [x + thicknessOfRung, y, z],

    // top rung front
    [x + thicknessOfRung, y, z],
    [x + thicknessOfRung, y + thicknessOfRung, z],
    [x + width, y, z],
    [x + thicknessOfRung, y + thicknessOfRung, z],
    [x + width, y + thicknessOfRung, z],
    [x + width, y, z],

    // middle rung front
    [x + thicknessOfRung, y + thicknessOfRung * 2, z],
    [x + thicknessOfRung, y + thicknessOfRung * 3, z],
    [x + width * (2 / 3), y + thicknessOfRung * 2, z],
    [x + thicknessOfRung, y + thicknessOfRung * 3, z],
    [x + width * (2 / 3), y + thicknessOfRung * 3, z],
    [x + width * (2 / 3), y + thicknessOfRung * 2, z],

    // left column back
    [x, y, z + depth],
    [x + thicknessOfRung, y, z + depth],
    [x, y + height, z + depth],
    [x, y + height, z + depth],
    [x + thicknessOfRung, y, z + depth],
    [x + thicknessOfRung, y + height, z + depth],

    // top rung back
    [x + thicknessOfRung, y, z + depth],
    [x + width, y, z + depth],
    [x + thicknessOfRung, y + thicknessOfRung, z + depth],
    [x + thicknessOfRung, y + thicknessOfRung, z + depth],
    [x + width, y, z + depth],
    [x + width, y + thicknessOfRung, z + depth],

    // middle rung back
    [x + thicknessOfRung, y + thicknessOfRung * 2, z + depth],
    [x + width * (2 / 3), y + thicknessOfRung * 2, z + depth],
    [x + thicknessOfRung, y + thicknessOfRung * 3, z + depth],
    [x + thicknessOfRung, y + thicknessOfRung * 3, z + depth],
    [x + width * (2 / 3), y + thicknessOfRung * 2, z + depth],
    [x + width * (2 / 3), y + thicknessOfRung * 3, z + depth],

    // top
    [x, y, z],
    [x + width, y, z],
    [x + width, y, z + depth],
    [x, y, z],
    [x + width, y, z + depth],
    [x, y, z + depth],

    // top rung right
    [x + width, y, z],
    [x + width, y + thicknessOfRung, z],
    [x + width, y + thicknessOfRung, z + depth],
    [x + width, y, z],
    [x + width, y + thicknessOfRung, z + depth],
    [x + width, y, z + depth],

    // under top rung
    [x + thicknessOfRung, y + thicknessOfRung, z],
    [x + thicknessOfRung, y + thicknessOfRung, z + depth],
    [x + width, y + thicknessOfRung, z + depth],
    [x + thicknessOfRung, y + thicknessOfRung, z],
    [x + width, y + thicknessOfRung, z + depth],
    [x + width, y + thicknessOfRung, z],

    // between top rung and middle
    [x + thicknessOfRung, y + thicknessOfRung, z],
    [x + thicknessOfRung, y + thicknessOfRung * 2, z + depth],
    [x + thicknessOfRung, y + thicknessOfRung, z + depth],
    [x + thicknessOfRung, y + thicknessOfRung, z],
    [x + thicknessOfRung, y + thicknessOfRung * 2, z],
    [x + thicknessOfRung, y + thicknessOfRung * 2, z + depth],

    // top of middle rung
    [x + thicknessOfRung, y + thicknessOfRung * 2, z],
    [x + width * (2 / 3), y + thicknessOfRung * 2, z + depth],
    [x + thicknessOfRung, y + thicknessOfRung * 2, z + depth],
    [x + thicknessOfRung, y + thicknessOfRung * 2, z],
    [x + width * (2 / 3), y + thicknessOfRung * 2, z],
    [x + width * (2 / 3), y + thicknessOfRung * 2, z + depth],

    // right of middle rung
    [x + width * (2 / 3), y + thicknessOfRung * 2, z],
    [x + width * (2 / 3), y + thicknessOfRung * 3, z + depth],
    [x + width * (2 / 3), y + thicknessOfRung * 2, z + depth],
    [x + width * (2 / 3), y + thicknessOfRung * 2, z],
    [x + width * (2 / 3), y + thicknessOfRung * 3, z],
    [x + width * (2 / 3), y + thicknessOfRung * 3, z + depth],

    // bottom of middle rung
    [x + thicknessOfRung, y + thicknessOfRung * 3, z],
    [x + thicknessOfRung, y + thicknessOfRung * 3, z + depth],
    [x + width * (2 / 3), y + thicknessOfRung * 3, z + depth],
    [x + thicknessOfRung, y + thicknessOfRung * 3, z],
    [x + width * (2 / 3), y + thicknessOfRung * 3, z + depth],
    [x + width * (2 / 3), y + thicknessOfRung * 3, z],

    // right of bottom
    [x + thicknessOfRung, y + thicknessOfRung * 3, z],
    [x + thicknessOfRung, y + height, z + depth],
    [x + thicknessOfRung, y + thicknessOfRung * 3, z + depth],
    [x + thicknessOfRung, y + thicknessOfRung * 3, z],
    [x + thicknessOfRung, y + height, z],
    [x + thicknessOfRung, y + height, z + depth],

    // bottom
    [x, y + height, z],
    [x, y + height, z + depth],
    [x + thicknessOfRung, y + height, z + depth],
    [x, y + height, z],
    [x + thicknessOfRung, y + height, z + depth],
    [x + thicknessOfRung, y + height, z],

    // left side
    [x, y, z],
    [x, y, z + depth],
    [x, y + height, z + depth],
    [x, y, z],
    [x, y + height, z + depth],
    [x, y + height, z],
  ];
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(
      vertices.reduce((prevValue, currValue) => {
        prevValue.push(currValue[0]);
        prevValue.push(currValue[1]);
        prevValue.push(currValue[2]);
        return prevValue;
      }, [])
    ),
    gl.STATIC_DRAW
  );
};
export { setFGeometry };
