import { vec3 } from "gl-matrix";

export const Polygons = {
  // prettier-ignore
  Cube: {
    blockSize: 5 * 4,
    vertices: Float32Array.from([
      -0.5,  0.5, 0.0, 0.0, 0.0,
      -0.5, -0.5, 0.0, 0.0, 1.0,
       0.5, -0.5, 0.0, 1.0, 1.0,
       0.5,  0.5, 0.0, 1.0, 0.0,
      -0.5,  0.5, 0.0, 0.0, 0.0,

      -0.5, -0.5, 0.0, 1.0, 1.0,
      -0.5,  0.5, 0.0, 1.0, 0.0,
      -0.5,  0.5, 1.0, 0.0, 0.0,
      -0.5, -0.5, 1.0, 0.0, 1.0,
      -0.5, -0.5, 0.0, 1.0, 1.0,

       0.5, -0.5, 1.0, 1.0, 1.0,
       0.5, -0.5, 0.0, 1.0, 0.0,
      -0.5, -0.5, 0.0, 0.0, 0.0,
      -0.5, -0.5, 1.0, 0.0, 1.0,
       0.5, -0.5, 1.0, 1.0, 1.0  // Vértice 2 (compartilhado)
    ]),
    // prettier-ignore
    normals: Float32Array.from([
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
    ]),
  },

  // prettier-ignore
  Triangle: Float32Array.from([
    //  X     Y   TX   TY
     -0.5,  0.5, 0.0, 0.0,
     -0.5, -0.5, 0.0, 1.0,
      0.5, -0.5, 1.0, 1.0,
      0.5,  0.5, 1.0, 0.0,
     -0.5,  0.5, 0.0, 0.0,
   ]),

  Cube3D: {
    // prettier-ignore
    vertices: new Float32Array([
      -.5,-.5,-.5,   0,1,1,
      -.5, .5, .5,   0,1,1,
      -.5, .5,-.5,   0,1,1,
      -.5,-.5, .5,   0,1,1,
      -.5, .5, .5,   0,1,1,
      -.5,-.5,-.5,   0,1,1,

      .5 ,-.5,-.5,   1,0,1,
      .5 , .5,-.5,   1,0,1,
      .5 , .5, .5,   1,0,1,
      .5 , .5, .5,   1,0,1,
      .5 ,-.5, .5,   1,0,1,
      .5 ,-.5,-.5,   1,0,1,

      -.5,-.5,-.5,   0,1,0,
       .5,-.5,-.5,   0,1,0,
       .5,-.5, .5,   0,1,0,
       .5,-.5, .5,   0,1,0,
      -.5,-.5, .5,   0,1,0,
      -.5,-.5,-.5,   0,1,0,

      -.5, .5,-.5,   1,1,0,
       .5, .5, .5,   1,1,0,
       .5, .5,-.5,   1,1,0,
      -.5, .5, .5,   1,1,0,
       .5, .5, .5,   1,1,0,
      -.5, .5,-.5,   1,1,0,

       .5,-.5,-.5,   0,0,1,
      -.5,-.5,-.5,   0,0,1,
       .5, .5,-.5,   0,0,1,
      -.5, .5,-.5,   0,0,1,
       .5, .5,-.5,   0,0,1,
      -.5,-.5,-.5,   0,0,1,

      -.5,-.5, .5,   1,0,0,
       .5,-.5, .5,   1,0,0,
       .5, .5, .5,   1,0,0,
       .5, .5, .5,   1,0,0,
      -.5, .5, .5,   1,0,0,
      -.5,-.5, .5,   1,0,0,
  ]),

    // prettier-ignore
    normals: new Float32Array([
      // Normais para a face frontal
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      // Normais para a face traseira
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,

      // Normais para a face inferior
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      // Normais para a face superior
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      // Normais para a face lateral esquerda
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      // Normais para a face lateral direita
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
    ]),
  },
};

export function calcNormals(vertices: Float32Array): Float32Array {
  const normals = new Float32Array(vertices.length);
  for (let i = 0; i < vertices.length; i += 9) {
    const v1 = vec3.fromValues(vertices[i], vertices[i + 1], vertices[i + 2]);
    const v2 = vec3.fromValues(
      vertices[i + 3],
      vertices[i + 4],
      vertices[i + 5]
    );
    const v3 = vec3.fromValues(
      vertices[i + 6],
      vertices[i + 7],
      vertices[i + 8]
    );

    const normal = vec3.create();
    vec3.cross(
      normal,
      vec3.subtract(vec3.create(), v2, v1),
      vec3.subtract(vec3.create(), v3, v1)
    );
    vec3.normalize(normal, normal);

    // Atribuir a normal aos três vértices da face
    for (let j = 0; j < 9; j += 3) {
      normals[i + j] = normal[0];
      normals[i + j + 1] = normal[1];
      normals[i + j + 2] = normal[2];
    }
  }

  return normals;
}
