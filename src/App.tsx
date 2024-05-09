import { RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import Loading from "./components/common/Loading";
import router from "./Router";
import { auth } from "./firebase";

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    font-family: "Noto Sans KR", sans-serif;
    line-height: 1;
  }
`;

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

export default App;
