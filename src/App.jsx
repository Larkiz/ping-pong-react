import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { GameBoardForSolo } from "./components/gameSolo";
import { GameBoardForDuo } from "./components/gameDuo";
import { MainMenu } from "./components/mainMenu";
import { Settings } from "./components/settings";
import { GamBoardOnline } from "./components/gameOnline";
function App() {
  return (
    <Routes>
      <Route path="game/solo" element={<GameBoardForSolo />} />
      <Route path="game/duo" element={<GameBoardForDuo />} />
      <Route path="game/online" element={<GamBoardOnline />} />
      <Route path="settings" element={<Settings />} />
      <Route path="/" element={<MainMenu />} />
    </Routes>
  );
}

export default App;
