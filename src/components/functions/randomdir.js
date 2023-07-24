// случайное направление мяча
export function randomDir() {
  let ballXDirection, ballYDirection;
  if (Math.round(Math.random()) == 1) {
    ballXDirection = 1;
  } else {
    ballXDirection = -1;
  }
  if (Math.round(Math.random()) == 1) {
    ballYDirection = 1;
  } else {
    ballYDirection = -1;
  }
  return { x: ballXDirection, y: ballYDirection };
}
