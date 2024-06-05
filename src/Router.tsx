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
import Bookmark from "./components/routes/Bookmark";
import Mypost from "./components/routes/MyPost";
import AccountSetting from "./components/routes/AccountSetting";
import PostDetail from "./components/routes/PostDetail";

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
        path: "post-detail/:postId",
        element: <PostDetail />,
      },
      {
        path: "mypage",
        element: <Mypage />,
        children: [
          {
            path: "bookmark",
            element: <Bookmark />,
          },
          {
            path: "my-post",
            element: <Mypost />,
          },
          {
            path: "account-setting",
            element: <AccountSetting />,
          },
        ],
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
