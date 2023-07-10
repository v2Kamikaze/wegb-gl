export const Shaders = {
  vertex: {
    src: `
        attribute vec4 aPos;
        //attribute vec4 aColor;
        attribute vec3 aNormal;

        uniform mat4 uModel;
        uniform mat4 uView;
        uniform mat4 uProjection;
        uniform vec3 uLightPosition;

        varying vec3 vNormal;
        varying vec3 vPoint2Light;

        void main() {
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

        vec4 color = vec4(1.0, 1.0, 1.0, 1.0);

        void main() {
            vec3 normal = normalize(vNormal);

            vec3 point2Light = normalize(vPoint2Light);
            vec3 lightDirection = normalize(-uLightDirection);

            float lightD = max(dot(lightDirection, normal), 0.0);
            float lightP = max(dot(point2Light, normal), 0.0);

            vec4 colorWithDirLight = 0.2 * vec4(uLightColor * lightD * color.rgb, color.a);
            vec4 colorWithPosLight = 0.8 * vec4(uLightColor * lightP * color.rgb, color.a);

            gl_FragColor =  colorWithDirLight + colorWithPosLight;
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
