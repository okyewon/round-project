import { useNavigate } from "react-router";
import { auth } from "../../firebase";

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
    <>
      <button className="btn" onClick={logOut}>
        로그 아웃
      </button>
    </>
  );
};

export default Mypage;
