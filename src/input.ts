import { vec3 } from "gl-matrix";

export function input(
  e: KeyboardEvent,
  cameraPosition: vec3,
  velocity: number
) {
  const keyPressed = e.key.toLowerCase();
  switch (keyPressed) {
    case "w":
      vec3.add(cameraPosition, cameraPosition, [0, 0, -1 * velocity]);
      break;
    case "a":
      vec3.add(cameraPosition, cameraPosition, [-1 * velocity, 0, 0]);
      break;
    case "s":
      vec3.add(cameraPosition, cameraPosition, [0, 0, 1 * velocity]);
      break;
    case "d":
      vec3.add(cameraPosition, cameraPosition, [1 * velocity, 0, 0]);
      break;
    case "q":
      vec3.add(cameraPosition, cameraPosition, [0, 1 * velocity, 0]);
      break;
    case "e":
      vec3.add(cameraPosition, cameraPosition, [0, -1 * velocity, 0]);
      break;
  }

  console.log(cameraPosition);
}
