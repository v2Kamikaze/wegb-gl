export function parseObjFile(fileContent: string) {
  const lines = fileContent.split("\n");
  const vertices: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  const colors: number[] = [];
  const textures: number[] = [];

  lines.forEach((line) => {
    const parts = line.trim().split(" ");
    const prefix = parts.shift();

    if (prefix === "v") {
      const vertex = parts.map((coord) => parseFloat(coord));
      vertices.push(...vertex);
    } else if (prefix === "vn") {
      const normal = parts.map((coord) => parseFloat(coord));
      normals.push(...normal);
    } else if (prefix === "f") {
      parts.forEach((part) => {
        const indicesTexCoords = part.split("/");
        const vertexIndex = parseInt(indicesTexCoords[0]) - 1;
        const normalIndex = parseInt(indicesTexCoords[2]) - 1;
        indices.push(vertexIndex);
        indices.push(normalIndex);

        if (indicesTexCoords[1]) {
          const textureIndex = parseInt(indicesTexCoords[1]) - 1;
          indices.push(textureIndex);
        }
      });
    } else if (prefix === "vc") {
      const color = parts.map((coord) => parseFloat(coord));
      colors.push(...color);
    } else if (prefix === "vt") {
      const textureCoord = parts.map((coord) => parseFloat(coord));
      textures.push(...textureCoord);
    }
  });

  const vertexArray = new Float32Array(vertices);
  const normalArray = new Float32Array(normals);
  const indexArray = new Uint16Array(indices);
  const colorArray = new Float32Array(colors);
  const textureArray = new Float32Array(textures);

  return {
    vertices: vertexArray,
    normals: normalArray,
    indices: indexArray,
    colors: colorArray,
    textures: textureArray,
  };
}
