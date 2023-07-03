
const canvas = document.querySelector<HTMLCanvasElement>('#app')!;
const ctx = canvas.getContext("2d")!
ctx.rect(20, 20, 150, 100);
ctx.fillStyle = "red";
ctx.fill();
