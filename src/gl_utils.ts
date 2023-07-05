export const GLUtils = {
  InitGL: function (): WebGLRenderingContext {
    const canvas = document.querySelector<HTMLCanvasElement>("#app")!;
    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext);

    if (gl === null) {
      window.alert("Seu navegador não suporta WebGL");
    }

    return gl;
  },

  CreateArrayBuffer: function (gl: WebGLRenderingContext, program: WebGLProgram, attrName: string, data: BufferSource): number {
    const bufferPointer = gl.createBuffer();
    if (!bufferPointer) {
      throw new Error("Não foi possível criar o buffer.");
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPointer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const positionPointer = gl.getAttribLocation(program, attrName);
    if (positionPointer === -1) {
      throw new Error(`Não foi possível obter '${attrName}'.`);
    }

    return positionPointer;
  },

  ClearCanvas: function (gl: WebGLRenderingContext) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  },

  CreateProgram: function (
    gl: WebGLRenderingContext,
    ...shaders: WebGLShader[]
  ) {
    const program = gl.createProgram();

    if (program === null) {
      throw new Error("Program nulo");
    } else {
      shaders.forEach((shader) => {
        gl.attachShader(program, shader);
      });

      gl.linkProgram(program);

      const success = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (!success) {
        const errorLog = gl.getProgramInfoLog(program);
        throw new Error(`Erro ao vincular programa: ${errorLog}`);
      }
    }

    return program;
  },

  CreateVertexShader: function (gl: WebGLRenderingContext, shaderSrc: string) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);

    if (vertexShader === null) {
      throw new Error("VertexShader nulo");
    } else {
      gl.shaderSource(vertexShader, shaderSrc);
      gl.compileShader(vertexShader);

      const success = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
      if (!success) {
        const errorLog = gl.getShaderInfoLog(vertexShader);
        throw new Error(`Erro na compilação do Vertex shader: ${errorLog}`);
      }
    }

    return vertexShader;
  },

  CreateFragmentShader: function (
    gl: WebGLRenderingContext,
    shaderSrc: string
  ) {
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    if (fragmentShader === null) {
      throw new Error("FragmentShader nulo");
    } else {
      gl.shaderSource(fragmentShader, shaderSrc);
      gl.compileShader(fragmentShader);

      const success = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
      if (!success) {
        const errorLog = gl.getShaderInfoLog(fragmentShader);
        throw new Error(`Erro na compilação do Fragment shader: ${errorLog}`);
      }
    }

    return fragmentShader;
  },
};
