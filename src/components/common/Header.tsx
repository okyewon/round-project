import { Link } from "react-router-dom";
import Nav from "./Nav";
import styled from "styled-components";
import { MdOutlinePets } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const logoRef = useRef<HTMLHeadingElement>(null);
  const [myPageWidth, setMyPageWidth] = useState(0);

  useEffect(() => {
    if (logoRef.current !== null) {
      setMyPageWidth(logoRef.current.offsetWidth);
    }
  }, []);

  return (
    <HeaderBar>
      <Logo ref={logoRef}>
        <Link to={"/home"}>
          <MdOutlinePets />
          동글동글
        </Link>
      </Logo>
      <Nav />
      <Link
        to={"/mypage/bookmark"}
        className="my-page"
        style={{ width: `${myPageWidth}px` }}
      >
        <FaCircleUser />
        My
      </Link>
    </HeaderBar>
  );
};

const HeaderBar = styled.header`
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 72px;
  padding: 0 80px;
  background-color: rgba(246, 254, 255, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  .my-page {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    font-size: 1.2rem;
    color: var(--primary-color);
    svg {
      font-size: 2rem;
    }
  }
`;

const Logo = styled.h1`
  a {
    display: flex;
    gap: 10px;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
  }
`;

export default Header;
