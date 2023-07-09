export const Shaders = {
  vertex: {
    src: `
        attribute vec4 aPos;
        attribute vec4 aColor;
        attribute vec3 aNormal;

        uniform mat4 uModel;
        uniform mat4 uView;
        uniform mat4 uProjection;

        varying vec4 vColor;
        varying vec3 vNormal;

        void main() {
            vNormal = vec3(uModel * vec4(aNormal, 1.0));
            vColor = aColor;
            gl_Position = uProjection * uView * uModel * aPos;
        }
    `,
    uniforms: {
      uModel: "uModel",
      uView: "uView",
      uProjection: "uProjection",
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

        varying vec4 vColor;
        varying vec3 vNormal;

        void main() {
            vec3 normal = normalize(vNormal);
            vec3 lightDirection = normalize(-uLightDirection);
            float lightIntensity = dot(lightDirection, normal);
            lightIntensity = max(lightIntensity, 0.0);
            vec4 colorWithDirLight = vec4(uLightColor * lightIntensity * vColor.rgb, vColor.a);
            gl_FragColor = colorWithDirLight;
        }
    `,
    uniforms: {
      uLightDirection: "uLightDirection",
      uLightColor: "uLightColor",
    },
    varying: {
      vColor: "vColor",
      vNormal: "vNormal",
    },
  },
};
