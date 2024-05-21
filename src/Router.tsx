import { createBrowserRouter } from "react-router-dom";
import Index from "./components/routes/Index";
import Map from "./components/routes/Map";
import Board from "./components/routes/Board";
import Mypage from "./components/routes/Mypage";
import Login from "./components/routes/Login";
import CreateAccount from "./components/routes/CreateAccount";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ResetPassword from "./components/routes/ResetPassword";
import PostWrite from "./components/routes/PostWrite";
import Home from "./components/routes/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "map",
        element: <Map />,
      },
      {
        path: "board",
        element: <Board />,
      },
      {
        path: "post-write",
        element: <PostWrite />,
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
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);

export default router;
