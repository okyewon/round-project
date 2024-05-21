import { Link, useLocation } from "react-router-dom";
import { FaMapLocationDot } from "react-icons/fa6";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { IoIosListBox } from "react-icons/io";

const category = [
  {
    path: "map",
    icon: <FaMapLocationDot />,
    desc: "지도",
  },
  {
    path: "board",
    icon: <IoIosListBox />,
    desc: "게시판",
  },
];

const Nav = () => {
  const location = useLocation();
  const [path, setPath] = useState(location.pathname);
  console.log(location);

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  return (
    <Wrapper>
      {category.map((item) => (
        <List key={item.path}>
          <Link
            to={`${item.path}`}
            className={path === `/` + item.path ? "on" : ""}
          >
            <span>{item.icon}</span>
            <span>{item.desc}</span>
          </Link>
        </List>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.ul`
  display: flex;
  gap: 32px;
`;

const List = styled.li`
  a {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    width: 440px;
    height: 46px;
    border-radius: 8px;
    background-color: #fff;
    font-size: 1.3rem;
    font-weight: 500;
    transition: all 0.3s;

    &.on,
    &:hover {
      background-color: var(--primary-color);
      color: #fff;
    }
  }
`;

export default Nav;
