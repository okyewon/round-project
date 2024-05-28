import { Outlet } from "react-router";
import Header from "../common/Header";
import styled from "styled-components";

const Index = () => {
  return (
    <Wrapper className="min-h-screen">
      <Header />
      <Outlet />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Index;
