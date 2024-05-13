import { createBrowserRouter } from "react-router-dom";
import Index from "./components/routes/Index";
import Map from "./components/routes/Map";
import Board from "./components/routes/Board";
import BoardWrite from "./components/routes/BoardWrite";
import Mypage from "./components/routes/Mypage";
import Login from "./components/routes/Login";
import CreateAccount from "./components/routes/CreateAccount";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    children: [
      {
        path: "map",
        element: <Map />,
      },
      {
        path: "board",
        element: <Board />,
      },
      {
        path: "boardwrite",
        element: <BoardWrite />,
      },
      {
        path: "mypage",
        element: <Mypage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
]);

export default router;
