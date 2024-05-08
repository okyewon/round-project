import { BrowserRouter } from "react-router-dom";
import Header from "./components/common/Header";
import Router from "./router/router";

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Header />
      <Router />
    </BrowserRouter>
  );
};

export default App;
