import {
  multiply,
  matrix,
  Matrix,
  subtract,
  divide,
  norm,
  cross,
  transpose,
  inv,
  resize,
  MathArray,
} from "mathjs";

export const Mat = {
  createRotationMatrix: function (
    rotationX: number = 0,
    rotationY: number = 0,
    rotationZ: number = 0
  ): Matrix {
    const radX = (rotationX * Math.PI) / 180.0;
    const radY = (rotationY * Math.PI) / 180.0;
    const radZ = (rotationZ * Math.PI) / 180.0;

    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);

    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);

    const cosZ = Math.cos(radZ);
    const sinZ = Math.sin(radZ);

    const rotX = matrix([
      [1.0, 0.0, 0.0, 0.0],
      [0.0, cosX, -sinX, 0.0],
      [0.0, sinX, cosX, 0.0],
      [0.0, 0.0, 0.0, 1.0],
    ]);

    const rotY = matrix([
      [cosY, 0.0, -sinY, 0.0],
      [0.0, 1.0, 0.0, 0.0],
      [sinY, 0.0, cosY, 0.0],
      [0.0, 0.0, 0.0, 1.0],
    ]);

    const rotZ = matrix([
      [cosZ, -sinZ, 0.0, 0.0],
      [sinZ, cosZ, 0.0, 0.0],
      [0.0, 0.0, 1.0, 0.0],
      [0.0, 0.0, 0.0, 1.0],
    ]);

    let rotationMatrix = multiply(rotY, rotX);
    rotationMatrix = multiply(rotZ, rotationMatrix);

    return rotationMatrix;
  },

  createTranslationMatrix: function (x: number, y: number, z: number): Matrix {
    return matrix([
      [1, 0, 0, x],
      [0, 1, 0, y],
      [0, 0, 1, z],
      [0, 0, 0, 1],
    ]);
  },

  createPerspective: function (
    fovY: number,
    aspectRatio: number,
    zNear: number,
    zFar: number
  ): Matrix {
    fovY = (fovY * Math.PI) / 180;

    const fy = 1.0 / Math.tan(fovY / 2.0);
    const fx = fy / aspectRatio;
    const B = (-2 * zFar * zNear) / (zFar - zNear);
    const A = -(zFar + zNear) / (zFar - zNear);

    const proj = matrix([
      [fx, 0.0, 0.0, 0.0],
      [0.0, fy, 0.0, 0.0],
      [0.0, 0.0, A, B],
      [0.0, 0.0, -1.0, 1.0],
    ]);

    return proj;
  },

  createCamera(pos: MathArray, target: MathArray, up: MathArray): Matrix {
    var zc = subtract(pos, target);
    zc = divide(zc, norm(zc)) as MathArray;

    var yt = subtract(up, pos);
    yt = divide(yt, norm(yt)) as MathArray;

    var xc = cross(yt, zc);
    xc = divide(xc, norm(xc)) as MathArray;

    var yc = cross(zc, xc);
    yc = divide(yc, norm(yc)) as MathArray;

    var mt = inv(
      transpose(matrix([xc as number[], yc as number[], zc as number[]]))
    );

    mt = resize(mt, [4, 4], 0);
    mt.set([3, 3], 1);

    var mov = matrix([
      [1, 0, 0, -pos[0]],
      [0, 1, 0, -pos[1]],
      [0, 0, 1, -pos[2]],
      [0, 0, 0, 1],
    ]);

    var cam = multiply(mt, mov);

    return cam;
  },
};
