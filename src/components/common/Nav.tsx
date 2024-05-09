import { Link } from "react-router-dom";
import { FaMapLocationDot } from "react-icons/fa6";
import { LiaClipboardListSolid } from "react-icons/lia";

const category = [
  {
    path: "map",
    icon: <FaMapLocationDot />,
    desc: "지도",
  },
  {
    path: "board",
    icon: <LiaClipboardListSolid />,
    desc: "게시판",
  },
];

const Nav = () => {
  return (
    <nav>
      <ul className="flex">
        {category.map((item) => (
          <li key={item.path}>
            <Link to={`${item.path}`} className="flex flex-col items-center">
              <span>{item.icon}</span>
              <span>{item.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
