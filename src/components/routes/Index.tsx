import { Outlet } from "react-router";
import Header from "../common/Header";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
};

export default Index;
