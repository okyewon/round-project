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
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Type, Types } from "./Auth-components";

export default function GoogleBtn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "type") {
      setType(value);
    }
  };

  const onClick = async () => {
    if (!type) {
      alert("보호센터 or 개인 유형을 선택해주세요.");
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      // 구글 인증 수행
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      const googleCredential = GoogleAuthProvider.credentialFromResult(result);

      if (googleUser.email && googleCredential) {
        const signInMethods = await fetchSignInMethodsForEmail(
          auth,
          googleUser.email,
        );

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

              await setDoc(doc(db, "users", emailUser.user.uid), {
                email: googleUser.email,
                displayName: googleUser.displayName,
                userType: type,
                createdAt: new Date(),
              });

              navigate("/home", { replace: true });
            } catch (error) {
              console.error("이메일/비밀번호 로그인 실패:", error);
              alert("비밀번호가 잘못되었습니다.");
            }
          }
        } else {
          //todo: type 설정 물어보기(type버튼 삭제 후)
          await setDoc(doc(db, "users", googleUser.uid), {
            email: googleUser.email,
            displayName: googleUser.displayName,
            userType: type,
            createdAt: new Date(),
          });
          navigate("/home", { replace: true });
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
      <Types>
        <Type>
          <input onChange={onChange} type="radio" name="type" value="shelter" />
          보호센터
        </Type>
        <Type>
          <input
            onChange={onChange}
            type="radio"
            name="type"
            value="personal"
          />
          개인
        </Type>
      </Types>
      <Button onClick={onClick} className="btn">
        <Logo src="/google-logo.svg" />
        Google 계정으로 {location.pathname === "/login" ? "로그인" : "회원가입"}
      </Button>
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
