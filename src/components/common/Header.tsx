import { Link } from "react-router-dom";
import Nav from "./Nav";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-between">
      <h1 className="font-bold">
        <Link to={"/"}>동글동글</Link>
      </h1>
      <Nav />
      <Link to={"/"} />
    </header>
  );
};

export default Header;
