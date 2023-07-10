interface OBJData {
  vertices: number[];
  normals: number[];
  textureCoords: number[][];
  faces: number[][];
  // Outras propriedades opcionais do arquivo .obj
  // ...
}

export function parseOBJFile(objContent: string): OBJData {
  const lines = objContent.split("\n");
  const vertices: number[] = [];
  const normals: number[] = [];
  const textureCoords: number[][] = [];
  const faces: number[][] = [];

  for (const line of lines) {
    if (line.startsWith("v ")) {
      const vertex = line
        .trim()
        .split(/\s+/)
        .slice(1)
        .map((coord) => parseFloat(coord));
      vertices.push(...vertex);
    } else if (line.startsWith("vn ")) {
      const normal = line
        .trim()
        .split(/\s+/)
        .slice(1)
        .map((coord) => parseFloat(coord));
      normals.push(...normal);
    } else if (line.startsWith("vt ")) {
      const texCoord = line
        .trim()
        .split(/\s+/)
        .slice(1)
        .map((coord) => parseFloat(coord));
      textureCoords.push(texCoord);
    } else if (line.startsWith("f ")) {
    }
    // Outros casos de linhas do arquivo .obj
    // ...
  }

  return {
    vertices,
    normals,
    textureCoords,
    faces,
    // Outras propriedades extraídas do arquivo .obj
    // ...
  };
}

export const objMock = `

o Box
v 0.5 0.5 0.5
v 0.5 0.5 -0.5
v 0.5 -0.5 0.5
v 0.5 -0.5 -0.5
v -0.5 0.5 -0.5
v -0.5 0.5 0.5
v -0.5 -0.5 -0.5
v -0.5 -0.5 0.5
v -0.5 0.5 -0.5
v 0.5 0.5 -0.5
v -0.5 0.5 0.5
v 0.5 0.5 0.5
v -0.5 -0.5 0.5
v 0.5 -0.5 0.5
v -0.5 -0.5 -0.5
v 0.5 -0.5 -0.5
v -0.5 0.5 0.5
v 0.5 0.5 0.5
v -0.5 -0.5 0.5
v 0.5 -0.5 0.5
v 0.5 0.5 -0.5
v -0.5 0.5 -0.5
v 0.5 -0.5 -0.5
v -0.5 -0.5 -0.5
vt 0 1
vt 1 1
vt 0 0
vt 1 0
vt 0 1
vt 1 1
vt 0 0
vt 1 0
vt 0 1
vt 1 1
vt 0 0
vt 1 0
vt 0 1
vt 1 1
vt 0 0
vt 1 0
vt 0 1
vt 1 1
vt 0 0
vt 1 0
vt 0 1
vt 1 1
vt 0 0
vt 1 0
vn 1 0 0
vn 1 0 0
vn 1 0 0
vn 1 0 0
vn -1 0 0
vn -1 0 0
vn -1 0 0
vn -1 0 0
vn 0 1 0
vn 0 1 0
vn 0 1 0
vn 0 1 0
vn 0 -1 0
vn 0 -1 0
vn 0 -1 0
vn 0 -1 0
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 1
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
vn 0 0 -1
f 1/1/1 3/3/3 2/2/2
f 3/3/3 4/4/4 2/2/2
f 5/5/5 7/7/7 6/6/6
f 7/7/7 8/8/8 6/6/6
f 9/9/9 11/11/11 10/10/10
f 11/11/11 12/12/12 10/10/10
f 13/13/13 15/15/15 14/14/14
f 15/15/15 16/16/16 14/14/14
f 17/17/17 19/19/19 18/18/18
f 19/19/19 20/20/20 18/18/18
f 21/21/21 23/23/23 22/22/22
f 23/23/23 24/24/24 22/22/22


`;
