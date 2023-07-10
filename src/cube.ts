import { mat4, vec3 } from "gl-matrix";
import { GLUtils } from "./gl_utils";

// prettier-ignore
export const cubeVertices = new Float32Array([
  // Front face
  -1.0, -1.0, 1.0,
  1.0, -1.0, 1.0,
  1.0, 1.0, 1.0,
  -1.0, 1.0, 1.0,

  // Back face
  -1.0, -1.0, -1.0,
  -1.0, 1.0, -1.0,
  1.0, 1.0, -1.0,
  1.0, -1.0, -1.0,

  // Top face
  -1.0, 1.0, -1.0,
  -1.0, 1.0, 1.0,
  1.0, 1.0, 1.0,
  1.0, 1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0,
  1.0, -1.0, -1.0,
  1.0, -1.0, 1.0,
  -1.0, -1.0, 1.0,

  // Right face
  1.0, -1.0, -1.0,
  1.0, 1.0, -1.0,
  1.0, 1.0, 1.0,
  1.0, -1.0, 1.0,

  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0, 1.0,
  -1.0, 1.0, 1.0,
  -1.0, 1.0, -1.0,
]);

// prettier-ignore
export const cubeIndices = new Uint16Array([
  0,
  1,
  2,
  0,
  2,
  3, // front
  4,
  5,
  6,
  4,
  6,
  7, // back
  8,
  9,
  10,
  8,
  10,
  11, // top
  12,
  13,
  14,
  12,
  14,
  15, // bottom
  16,
  17,
  18,
  16,
  18,
  19, // right
  20,
  21,
  22,
  20,
  22,
  23, // left
]);

export const cubeNormals = new Float32Array([
  0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

  // Back
  0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

  // Top
  0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

  // Bottom
  0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

  // Right
  1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

  // Left
  -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
]);

export const CubeShaders = {
  vertex: {
    src: `
        attribute vec4 aPos;
        attribute vec4 aColor;
        attribute vec3 aNormal;

        uniform mat4 uModel;
        uniform mat4 uView;
        uniform mat4 uProjection;
        uniform vec3 uLightPosition;
        uniform vec3 uCameraPosition;

        varying vec4 vColor;
        varying vec3 vNormal;
        varying vec3 vPoint2Light;
        varying vec3 vCameraPosition;

        void main() {
            vColor = aColor;

            vCameraPosition = uCameraPosition - aPos.xyz;
            vPoint2Light = uLightPosition - aPos.xyz;
            vNormal = vec3(uModel * vec4(aNormal, 1.0));
            gl_Position = uProjection * uView * uModel * aPos;
        }
    `,
    uniforms: {
      uModel: "uModel",
      uView: "uView",
      uProjection: "uProjection",
      uLightPosition: "uLightPosition",
      uCameraPosition: "uCameraPosition",
    },
    attributes: {
      aPos: "aPos",
      aColor: "aColor",
      aNormal: "aNormal",
    },
    varying: {
      vColor: "vColor",
      vNormal: "vNormal",
    },
  },
  fragment: {
    src: `
        precision mediump float;

        uniform vec3 uLightDirection;
        uniform vec3 uLightColor;

        varying vec3 vNormal;
        varying vec3 vPoint2Light;
        varying vec3 vCameraPosition;

        varying vec4 vColor;
        vec4 color = vec4(0.9, 0.9, 0.9, 1.0);

        void main() {
            vec3 normal = normalize(vNormal);

            vec3 point2Light = normalize(vPoint2Light);
            vec3 lightDirection = normalize(-uLightDirection);
            vec3 cameraPosition = normalize(vCameraPosition);

            vec3 halfVec = normalize(cameraPosition + point2Light);

            float lightD = max(dot(normal, lightDirection), 0.0);
            float lightP = max(dot(normal, point2Light), 0.0);
            float lightE = max(dot(normal, halfVec), 0.0);

            vec4 colorWithDirLight = 0.1 * vec4(uLightColor * lightD * color.rgb, color.a);
            vec4 colorWithPosLight = 0.6 * vec4(uLightColor * lightP * color.rgb, color.a);
            vec4 colorWithEspLight = 0.1 * vec4(uLightColor * pow(lightE, 50.0) * color.rgb, color.a);
            vec4 colorWithAmbLight = 0.2 * color;


            gl_FragColor = colorWithAmbLight + colorWithEspLight + colorWithPosLight + colorWithDirLight;
        }
    `,
    uniforms: {
      uLightDirection: "uLightDirection",
      uLightColor: "uLightColor",
    },
    varying: {
      vColor: "vColor",
      vNormal: "vNormal",
      vPoint2Light: "vPoint2Light",
    },
  },
};

export function initCube(gl: WebGLRenderingContext) {
  const vertexShader = GLUtils.CreateVertexShader(gl, CubeShaders.vertex.src);
  const fragmentShader = GLUtils.CreateFragmentShader(
    gl,
    CubeShaders.fragment.src
  );
  const program = GLUtils.CreateProgram(gl, vertexShader, fragmentShader);

  const normalPointer = GLUtils.CreateArrayBuffer(
    gl,
    program,
    CubeShaders.vertex.attributes.aNormal,
    cubeNormals
  );

  const posPointer = GLUtils.CreateArrayBuffer(
    gl,
    program,
    CubeShaders.vertex.attributes.aPos,
    cubeVertices
  );

  gl.vertexAttribPointer(posPointer, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttribPointer(normalPointer, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(posPointer);
  gl.enableVertexAttribArray(normalPointer);

  return program;
}

export function setUniformsToCube(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  cameraPosition: vec3,
  model: mat4,
  view: mat4,
  projection: mat4
) {
  const uLightDirection = gl.getUniformLocation(
    program,
    CubeShaders.fragment.uniforms.uLightDirection
  );

  const uLightColor = gl.getUniformLocation(
    program,
    CubeShaders.fragment.uniforms.uLightColor
  );

  const uLightPosition = gl.getUniformLocation(
    program,
    CubeShaders.vertex.uniforms.uLightPosition
  );

  const uCameraPosition = gl.getUniformLocation(
    program,
    CubeShaders.vertex.uniforms.uCameraPosition
  );

  gl.uniform3fv(uLightDirection, [0, -5, -3]);
  gl.uniform3fv(uLightColor, [1, 1, 1]);
  gl.uniform3fv(uLightPosition, [0, 5, 1]);
  gl.uniform3fv(uCameraPosition, cameraPosition);

  const uModel = gl.getUniformLocation(
    program,
    CubeShaders.vertex.uniforms.uModel
  );
  const uView = gl.getUniformLocation(
    program,
    CubeShaders.vertex.uniforms.uView
  );
  const uProjection = gl.getUniformLocation(
    program,
    CubeShaders.vertex.uniforms.uProjection
  );

  gl.uniformMatrix4fv(uModel, false, model);
  gl.uniformMatrix4fv(uView, false, view);
  gl.uniformMatrix4fv(uProjection, false, projection);
}
