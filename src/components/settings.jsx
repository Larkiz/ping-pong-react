import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
export const Settings = () => {
  if (!localStorage.getItem("settings")) {
    localStorage.setItem(
      "settings",
      JSON.stringify({ minBallSpeed: 3, maxBallSpeed: 10, paddleSpeed: 5 })
    );
  }

  const [minBallSpeed, setMinBallSpeed] = useState(
    JSON.parse(localStorage.getItem("settings")).minBallSpeed
  );
  const [maxBallSpeed, setMaxBallSpeed] = useState(
    JSON.parse(localStorage.getItem("settings")).maxBallSpeed
  );
  const [paddleSpeed, setPaddleSpeed] = useState(
    JSON.parse(localStorage.getItem("settings")).paddleSpeed
  );

  useEffect(() => {
    const settings = {
      minBallSpeed: minBallSpeed,
      maxBallSpeed: maxBallSpeed,
      paddleSpeed: paddleSpeed,
    };

    localStorage.setItem("settings", JSON.stringify(settings));
  }, [minBallSpeed, maxBallSpeed, paddleSpeed]);

  function maxSpeedHandler(event) {
    const speed = Number(event.target.value);

    if (speed <= minBallSpeed) {
      setMinBallSpeed(speed);
    }
    setMaxBallSpeed(speed);
  }

  function minSpeedHandler(event) {
    const speed = Number(event.target.value);
    if (speed <= maxBallSpeed) {
      setMinBallSpeed(speed);
    }
  }

  return (
    <div className="settings-cont">
      <h1>Настройки</h1>

      <div>
        <h2>Скорость мяча</h2>
        <div className="speedSettings">
          <p> Минимальная скорость</p>

          <div>
            <input
              onChange={minSpeedHandler}
              value={minBallSpeed}
              type="range"
              min="3"
              max="13"
              step="1"
            />
            {minBallSpeed}
          </div>
        </div>
        <div className="speedSettings">
          <p> Максимальная скорость</p>
          <div>
            <input
              onChange={maxSpeedHandler}
              value={maxBallSpeed}
              type="range"
              min="3"
              max="13"
              step="1"
            />
            {maxBallSpeed}
          </div>
        </div>
      </div>

      <div>
        <h2>Платформы</h2>
        <div className="speedSettings">
          <p>Скорость</p>

          <div>
            <input
              onChange={(event) => setPaddleSpeed(Number(event.target.value))}
              value={paddleSpeed}
              type="range"
              min="5"
              max="9"
              step="1"
            />
            {paddleSpeed}
          </div>
        </div>
      </div>

      <h1>
        <Link to="/">Назад</Link>
      </h1>
    </div>
  );
};
