import { mat4, glMatrix, vec3 } from "gl-matrix";

interface ProjectionProps {
  aspectRatio: number;
  fov: number;
  near: number;
  far: number;
}

interface CameraProps {
  position: vec3;
  target: vec3;
}

export class Camera {
  public projectionMatrix: mat4;
  public viewMatrix: mat4;
  public position: vec3;
  public target: vec3;
  public up = vec3.fromValues(0, 1, 0);

  constructor() {
    this.viewMatrix = mat4.create();
    this.projectionMatrix = mat4.create();
    this.position = vec3.create();
    this.target = vec3.create();
  }

  updateViewMatrix({ position, target }: CameraProps): void {
    this.position = position;
    this.target = target;
    mat4.lookAt(this.viewMatrix, position, target, this.up);
  }

  updateProjectionMatrix({
    aspectRatio,
    fov,
    near,
    far,
  }: ProjectionProps): void {
    mat4.perspective(
      this.projectionMatrix,
      glMatrix.toRadian(fov),
      aspectRatio,
      near,
      far
    );
  }
}
