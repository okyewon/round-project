import { RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import Loading from "./components/common/Loading";
import router from "./Router";
import { auth } from "./firebase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecoilRoot } from "recoil";

const queryClient = new QueryClient();

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
    <RecoilRoot>
      <GlobalStyles />
      <QueryClientProvider client={queryClient}>
        {isLoading ? <Loading /> : <RouterProvider router={router} />}
      </QueryClientProvider>
    </RecoilRoot>
  );
};

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Pretendard';
    src: url('/font/Pretendard-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'Pretendard';
    src: url('/font/Pretendard-Medium.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
  }
  @font-face {
    font-family: 'Pretendard';
    src: url('/font/Pretendard-Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
  }
  ${reset};
  :root {
    --primary-color: rgb(0, 214, 243)
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: "Pretendard", sans-serif;
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
