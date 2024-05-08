import { Routes, Route } from "react-router-dom";
import Index from "../views/Index";
import Map from "../views/Map";
import Board from "../views/Board";
import BoardWrite from "../views/BoardWrite";
import Mypage from "../views/Mypage";
import Error from "../views/Error";

const Router = () => {
  return (
    <Routes>
      <Route path="*" element={<Error />} />
      <Route path="/" element={<Index />} />
      <Route path="/map" element={<Map />} />
      <Route path="/board" element={<Board />} />
      <Route path="/boardwrite" element={<BoardWrite />} />
      <Route path="/mypage" element={<Mypage />} />
    </Routes>
  );
};

export default Router;
