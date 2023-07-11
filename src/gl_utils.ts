export const GLUtils = {
  InitGL: function (): WebGLRenderingContext {
    const canvas = document.querySelector<HTMLCanvasElement>("#app")!;
    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext);

    if (gl === null) {
      window.alert("Seu navegador não suporta WebGL");
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.1, 0.1, 0.1, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    return gl;
  },

  LoadTextures: function (paths: string[]): Promise<HTMLImageElement[]> {
    const promises = paths.map((path) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const texture = new Image();
        texture.onload = () => resolve(texture);
        texture.onerror = () =>
          reject(new Error(`Failed to load texture: ${path}`));
        texture.src = path;
      });
    });

    return Promise.all(promises) as Promise<HTMLImageElement[]>;
  },

  LinkTexture: function (
    gl: WebGLRenderingContext,
    webglTextureObj: WebGLTexture,
    textureTarget: number,
    textureSrc: TexImageSource
  ) {
    gl.activeTexture(textureTarget);
    gl.bindTexture(gl.TEXTURE_2D, webglTextureObj);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      textureSrc
    );
  },

  CreateIndexBuffer: function (
    gl: WebGLRenderingContext,
    indices: Uint16Array
  ): WebGLBuffer {
    const buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error("Não foi possível criar o buffer de índices.");
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return buffer;
  },

  CreateArrayBuffer: function (
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    attrName: string,
    data: BufferSource,
    type: number = gl.ARRAY_BUFFER
  ): number {
    const bufferPointer = gl.createBuffer();
    if (!bufferPointer) {
      throw new Error("Não foi possível criar o buffer.");
    }

    gl.bindBuffer(type, bufferPointer);
    gl.bufferData(type, data, gl.STATIC_DRAW);

    const positionPointer = gl.getAttribLocation(program, attrName);
    if (positionPointer === -1) {
      throw new Error(`Não foi possível obter '${attrName}'.`);
    }

    return positionPointer;
  },

  ClearCanvas: function (gl: WebGLRenderingContext) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
