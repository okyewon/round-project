import { Link } from "react-router-dom";
import { FaMapLocationDot } from "react-icons/fa6";
import { LiaClipboardListSolid } from "react-icons/lia";

const Nav = () => {
  return (
    <nav>
      <ul className="">
        <li>
          <Link to={"/map"}>
            <FaMapLocationDot />
            <span>지도</span>
          </Link>
        </li>
        <li>
          <Link to={"/board"}>
            <LiaClipboardListSolid />
            <span>게시판</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
