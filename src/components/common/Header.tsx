import { Link } from "react-router-dom";
import Nav from "./Nav";
import styled from "styled-components";
import { MdOutlinePets } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";

const Header = () => {
  return (
    <HeaderBar>
      <Logo>
        <Link to={"/home"}>
          <MdOutlinePets />
          동글동글
        </Link>
      </Logo>
      <Nav />
      <Link to={"/mypage"} className="my-page">
        <FaCircleUser />
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

  .my-page {
    font-size: 32px;
    color: var(--primary-color);
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
