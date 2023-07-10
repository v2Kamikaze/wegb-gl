export const Shaders = {
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
