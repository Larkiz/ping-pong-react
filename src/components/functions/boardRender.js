// рендер поля
export function board(canvas, ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.strokeStyle = "grey";

  ctx.arc(canvas.width * 0.5, canvas.height * 0.5, 80, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = "grey";
  ctx.fillRect(canvas.width * 0.5, canvas.height * 0.5 + 80, 1, canvas.height);

  ctx.beginPath();
  ctx.fillStyle = "grey";
  ctx.fillRect(canvas.width * 0.5, canvas.height * 0.5 - 80, 1, -canvas.height);
}
