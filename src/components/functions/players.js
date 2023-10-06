// обработать перемещение второго объекта
export function botPlay(rightPaddle, ballStats, canvas, ctx, speed) {
  if (rightPaddle.y + rightPaddle.width + 45 <= ballStats.y + 20) {
    rightPaddle.y += speed;
  }
  if (rightPaddle.y + rightPaddle.width + 45 >= ballStats.y + 20) {
    rightPaddle.y -= speed;
  }

  if (rightPaddle.y < 0) {
    rightPaddle.y += speed;
  }
  if (rightPaddle.y > canvas.height - 100) {
    rightPaddle.y -= speed;
  }

  ctx.fillStyle = "white";
  ctx.fillRect(
    rightPaddle.x,
    rightPaddle.y,
    rightPaddle.width,
    rightPaddle.height
  );
}

// обработать перемещение первого объекта
export function playerFirst(
  moveUp1,
  speed,
  moveDown1,
  leftPaddle,
  canvas,
  ctx
) {
  let dy = 0;
  if (moveUp1) {
    dy = -speed;
  }
  if (moveDown1) {
    dy = speed;
  }

  leftPaddle.y += dy;

  if (leftPaddle.y < 0 || leftPaddle.y > canvas.height - 100) {
    leftPaddle.y -= dy;
  }

  ctx.fillStyle = "white";
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
}

// обработать перемещение второго объекта
export function playerSecond(
  moveUpRight,
  speed,
  moveDownRight,
  rightPaddle,
  canvas,
  ctx
) {
  let dy = 0;
  if (moveUpRight) {
    dy = -speed;
  }
  if (moveDownRight) {
    dy = speed;
  }

  rightPaddle.y += dy;

  if (rightPaddle.y < 0 || rightPaddle.y > canvas.height - 100) {
    rightPaddle.y -= dy;
  }

  ctx.fillStyle = "white";
  ctx.fillRect(
    rightPaddle.x,
    rightPaddle.y,
    rightPaddle.width,
    rightPaddle.height
  );
}
