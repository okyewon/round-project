import { useNavigate } from "react-router";
import { auth } from "../../firebase";
import styled from "styled-components";

const Mypage = () => {
  const navigate = useNavigate();
  const logOut = async () => {
    const ok = confirm("로그아웃 하시겠어요?");
    if (ok) {
      await auth.signOut();
      navigate("/login");
    }
  };

  return (
    <Wrapper>
      <button className="btn" onClick={logOut}>
        로그 아웃
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export default Mypage;
