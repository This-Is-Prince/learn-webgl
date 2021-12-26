type Mat4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];
type Identity = () => Mat4;
type Scaling = (sx: number, sy: number, sz: number) => Mat4;
type xRotation = (rx: number) => Mat4;

interface M4 {
  identity: Identity;
  scaling: Scaling;
}

const m4: M4 = {
  identity: () => {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  },
  scaling: (sx, sy, sz) => {
    return [
      [sx, 0, 0, 0],
      [0, sy, 0, 0],
      [0, 0, sz, 0],
      [0, 0, 0, 1],
    ];
  },
};

export default m4;
