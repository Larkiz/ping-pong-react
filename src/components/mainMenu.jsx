import { Link } from "react-router-dom";
export const MainMenu = () => {
  return (
    <div className="main-menu">
      <h1>PONG</h1>
      <h2>
        <Link to="game/solo">Играть в одиночку</Link>
      </h2>
      <h2>
        <Link to="game/duo">Играть вдвоем</Link>
      </h2>
      <h2>
        <Link to="game/online">Играть онлайн</Link>
      </h2>
      <h2>
        <Link to="settings">Настройки</Link>
      </h2>
    </div>
  );
};
