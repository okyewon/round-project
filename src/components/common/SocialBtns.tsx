import {
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { auth } from "../../firebase";
import TypeModal from "./TypeModal";
import { useState } from "react";

export default function GoogleBtn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [modal, setModal] = useState(false);

  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // 구글 인증 수행
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      const googleCredential = GoogleAuthProvider.credentialFromResult(result);
      console.log(googleUser.email);
      console.log(googleCredential);

      if (googleUser.email && googleCredential) {
        const signInMethods = await fetchSignInMethodsForEmail(
          auth,
          googleUser.email,
        );
        console.log(signInMethods);

        if (signInMethods.includes("password")) {
          // 이메일/비밀번호 계정이 존재하는 경우
          const password = prompt(
            "이메일/비밀번호 계정과 병합하려면 비밀번호를 입력하세요:",
          );
          if (password) {
            try {
              const emailUser = await signInWithEmailAndPassword(
                auth,
                googleUser.email,
                password,
              );

              await linkWithCredential(emailUser.user, googleCredential);
              console.log("계정 병합 성공:", emailUser.user);

              navigate("/home", { replace: true });
            } catch (error) {
              console.error("이메일/비밀번호 로그인 실패:", error);
              alert("비밀번호가 잘못되었습니다.");
            }
          }
        } else {
          setModal(true);
        }
      }
    } catch (e) {
      if (e instanceof FirebaseError) {
        alert(e.code);
      }
    }
  };

  return (
    <>
      <Button onClick={onClick} className="btn">
        <Logo src="/google-logo.svg" />
        Google 계정으로 {location.pathname === "/login" ? "로그인" : "회원가입"}
      </Button>
      {modal ? <TypeModal /> : null}
    </>
  );
}

const Button = styled.span`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
  background-color: white;
  font-size: 1.1rem;
  font-weight: 500;
`;

const Logo = styled.img`
  height: 60%;
`;
