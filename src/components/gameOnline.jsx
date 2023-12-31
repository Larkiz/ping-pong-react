import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { randomDir } from "./functions/randomdir";
import { board } from "./functions/boardRender";

export const GamBoardOnline = () => {
  const socket = useRef();
  socket.current = new WebSocket("ws://26.1.73.214:5000");

  if (!localStorage.getItem("settings")) {
    localStorage.setItem(
      "settings",
      JSON.stringify({ minBallSpeed: 3, maxBallSpeed: 10, paddleSpeed: 5 })
    );
  }
  const settings = JSON.parse(localStorage.getItem("settings"));

  const count = { left: 0, right: 0 };

  useEffect(() => {
    const canvas = document.getElementById("gameBoard");
    const ctx = canvas.getContext("2d");

    let speed = settings.paddleSpeed;
    let ballSpeed = settings.minBallSpeed;

    const keysUp = ["w", "ц", "W", "Ц"];
    const keysDown = ["S", "s", "ы", "Ы"];

    let moveUpLeft = false;
    let moveDownLeft = false;
    let moveUpRight = false;
    let moveDownRight = false;

    let leftPaddle = {
      x: 175,
      y: canvas.height * 0.5 - 50,
      width: 25,
      height: 100,
      type: "leftPaddle",
    };
    let rightPaddle = {
      x: canvas.width - 175,
      y: canvas.height * 0.5 - 50,
      width: 25,
      height: 100,
      type: "rightPaddle",
    };

    let ballStats = {
      x: canvas.width * 0.5,
      y: canvas.height * 0.5 - 50,
      radius: 20,
    };

    let ballDir = randomDir();

    let ballDy = ballSpeed * ballDir.x;
    let ballDx = ballSpeed * ballDir.y;

    socket.current.onopen = () => {
      socket.current.onmessage = (e) => {
        let data = JSON.parse(e.data);

        if (data.type == "directionBall") {
          console.log(data);
          ballDy = data.dY;
          ballDx = data.dX;
        }
        if (data.type == "ball") {
          ballStats.x = data.x;
          ballStats.y = data.y;
        }

        let dy = 0;
        if (data.type == "leftPaddle") {
          if (moveUpLeft) {
            dy = -speed;
            data.y += dy;
          }
          if (moveDownLeft) {
            dy = speed;
            data.y += dy;
          }
          if (data.y < 0 || data.y > canvas.height - 100) {
            data.y -= dy;
          }
          leftPaddle.y = data.y;
        }

        if (data.type == "rightPaddle") {
          if (moveUpRight) {
            dy = -speed;
            data.y += dy;
          }
          if (moveDownRight) {
            dy = speed;
            data.y += dy;
          }
          if (data.y < 0 || data.y > canvas.height - 100) {
            data.y -= dy;
          }
          rightPaddle.y = data.y;
        }
      };
    };
    // Игра
    requestAnimationFrame(game);

    function game() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      board(canvas, ctx);
      playerFirst();
      playerSecond();
      win();
      controlPlayers();
      ball();
      if (
        window.location.pathname.split("/").filter((i) => i !== "")[0] !==
        "game"
      ) {
        return;
      }
      requestAnimationFrame(game);
    }

    // победа
    function win() {
      if (ballStats.x > rightPaddle.x + 25) {
        count.left += 1;

        const countLeft = document.getElementById("countLeft");
        if (countLeft) {
          countLeft.textContent = count.left;
        }

        ballDir = randomDir();

        ballDy = ballSpeed * ballDir.x;
        ballDx = ballSpeed * ballDir.y;

        ballStats.x = canvas.width * 0.5;
        ballStats.y = canvas.height * 0.5;
        socket.current.send(
          JSON.stringify({ dX: ballDx, dY: ballDy, type: "directionBall" })
        );
        return;
      }

      if (ballStats.x < leftPaddle.x - 25) {
        count.right += 1;

        const countRight = document.getElementById("countRight");
        if (countRight) {
          countRight.textContent = count.right;
        }

        ballDir = randomDir();
        ballDy = ballSpeed * ballDir.x;
        ballDx = ballSpeed * ballDir.y;

        ballStats.x = canvas.width * 0.5;
        ballStats.y = canvas.height * 0.5;

        socket.current.send(
          JSON.stringify({ dX: ballDx, dY: ballDy, type: "directionBall" })
        );

        return;
      }
    }

    // рендер мяча и его физика
    function ball() {
      ballStats.y += ballDy;
      ballStats.x += ballDx;

      if (socket.current.readyState > 0) {
        socket.current.send(
          JSON.stringify({ x: ballStats.x, y: ballStats.y, type: "ball" })
        );
      }

      // коллизия
      if (ballStats.y - 20 < 0 || ballStats.y > canvas.height - 20) {
        ballDy *= -1;
      }

      if (ballStats.x <= leftPaddle.x + leftPaddle.width + ballStats.radius) {
        if (
          ballStats.y > leftPaddle.y &&
          ballStats.y < leftPaddle.y + leftPaddle.height
        ) {
          ballStats.x = leftPaddle.x + leftPaddle.width + ballStats.radius;
          ballDx *= -1;

          if (ballDx !== settings.maxBallSpeed) {
            ballDx += 1;
            ballDy += 1;
          }
        }
        socket.current.send(
          JSON.stringify({ x: ballStats.x, y: ballStats.y, type: "ball" })
        );
        socket.current.send(
          JSON.stringify({ dX: ballDx, dY: ballDy, type: "directionBall" })
        );
      }

      if (ballStats.x >= rightPaddle.x - ballStats.radius) {
        if (
          ballStats.y > rightPaddle.y &&
          ballStats.y < rightPaddle.y + rightPaddle.height
        ) {
          ballStats.x = rightPaddle.x - ballStats.radius;
          ballDx *= -1;

          if (ballDx !== -settings.maxBallSpeed) {
            ballDx -= 1;
            ballDy -= 1;
          }
        }
        socket.current.send(
          JSON.stringify({ x: ballStats.x, y: ballStats.y, type: "ball" })
        );
        socket.current.send(
          JSON.stringify({ dX: ballDx, dY: ballDy, type: "directionBall" })
        );
      }

      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(ballStats.x, ballStats.y, ballStats.radius, 0, 2 * Math.PI);
      ctx.fill();
    }

    // обработать перемещение первого объекта
    function playerFirst() {
      let dy = 0;
      if (moveUpLeft) {
        dy = -speed;
        socket.current.send(JSON.stringify(leftPaddle));
      }
      if (moveDownLeft) {
        dy = speed;
        socket.current.send(JSON.stringify(leftPaddle));
      }

      leftPaddle.y += dy;

      if (leftPaddle.y < 0 || leftPaddle.y > canvas.height - 100) {
        leftPaddle.y -= dy;
      }

      ctx.fillStyle = "white";
      ctx.fillRect(
        leftPaddle.x,
        leftPaddle.y,
        leftPaddle.width,
        leftPaddle.height
      );
    }

    // обработать перемещение второго объекта
    function playerSecond() {
      let dy = 0;
      if (moveUpRight) {
        dy = -speed;
        socket.current.send(JSON.stringify(rightPaddle));
      }
      if (moveDownRight) {
        dy = speed;
        socket.current.send(JSON.stringify(rightPaddle));
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

    // управление
    function controlPlayers() {
      document.addEventListener("keydown", function (event) {
        if (keysUp.includes(event.key)) {
          moveUpLeft = true;
        }
        if (keysDown.includes(event.key)) {
          moveDownLeft = true;
        }

        if (event.key == "ArrowUp") {
          moveUpRight = true;
        }
        if (event.key == "ArrowDown") {
          moveDownRight = true;
        }
      });

      document.addEventListener("keyup", function (event) {
        if (keysUp.includes(event.key)) {
          moveUpLeft = false;
        }
        if (keysDown.includes(event.key)) {
          moveDownLeft = false;
        }

        if (event.key == "ArrowUp") {
          moveUpRight = false;
        }
        if (event.key == "ArrowDown") {
          moveDownRight = false;
        }
      });
    }
  });
  return (
    <div className="game-cont">
      <canvas id="gameBoard" width="1200px" height="640px"></canvas>
      <div className="count-cont">
        <h1 id="countLeft">0</h1>
        <h1>:</h1>
        <h1 id="countRight">0</h1>
      </div>
      <h1>
        <Link to="/">Вернуться в меню</Link>
      </h1>
    </div>
  );
};
