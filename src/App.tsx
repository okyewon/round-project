import { RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import Loading from "./components/common/Loading";
import router from "./Router";
import { auth } from "./firebase";

const App = (): JSX.Element => {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <GlobalStyles />
      {isLoading ? <Loading /> : <RouterProvider router={router} />}
    </>
  );
};

const GlobalStyles = createGlobalStyle`
  ${reset};
  :root {
    --primary-color: #00D6F3
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: "Noto Sans KR", sans-serif;
    line-height: 1;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  button {
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
`;
export default App;
