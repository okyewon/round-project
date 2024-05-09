import { Outlet } from "react-router";
import Header from "../common/Header";

const Index = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Index;
