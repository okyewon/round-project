import { auth } from "../../firebase";

const Mypage = () => {
  const logOut = () => {
    auth.signOut();
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
