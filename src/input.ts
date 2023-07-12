import { vec3 } from "gl-matrix";

export function moveCallback(
  e: KeyboardEvent,
  cameraPosition: vec3,
  cameraFront: vec3,
  up: vec3
) {
  const keyPressed = e.key.toLowerCase();
  let dir = vec3.create();
  switch (keyPressed) {
    case "w":
      vec3.add(cameraPosition, cameraPosition, cameraFront);
      break;
    case "s":
      vec3.sub(cameraPosition, cameraPosition, cameraFront);
      break;
    case "a":
      dir = vec3.cross(vec3.create(), cameraFront, up);
      dir = vec3.normalize(vec3.create(), dir);
      vec3.sub(cameraPosition, cameraPosition, dir);
      break;
    case "d":
      dir = vec3.cross(vec3.create(), cameraFront, up);
      dir = vec3.normalize(vec3.create(), dir);
      vec3.add(cameraPosition, cameraPosition, dir);
      break;
  }
}
