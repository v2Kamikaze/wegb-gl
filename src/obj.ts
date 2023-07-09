export interface OBJVertex {
  position: number[];
  normal: number[];
  uv: number[];
}

export interface OBJMesh {
  vertices: OBJVertex[];
  indices: number[];
}

export function parseOBJ(objData: string): OBJMesh {
  const lines = objData.split("\n");
  const vertices: OBJVertex[] = [];
  const indices: number[] = [];

  for (const line of lines) {
    const parts = line.trim().split(" ");
    const type = parts.shift();

    if (type === "v") {
      const position = parts.map(parseFloat);
      vertices.push({ position, normal: [], uv: [] });
    } else if (type === "vn") {
      const normal = parts.map(parseFloat);
      const lastVertex = vertices[vertices.length - 1];
      lastVertex.normal = normal;
    } else if (type === "vt") {
      const uv = parts.map(parseFloat);
      const lastVertex = vertices[vertices.length - 1];
      lastVertex.uv = uv;
    } else if (type === "f") {
      for (const facePart of parts) {
        const indicesData = facePart.split("/");
        const vertexIndex = parseInt(indicesData[0]) - 1;
        indices.push(vertexIndex);
      }
    }
  }

  return { vertices, indices };
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
