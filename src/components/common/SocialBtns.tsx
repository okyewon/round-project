import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Types } from "./Auth-components";

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
    try {
      const provider = new GoogleAuthProvider();
      // 구글 인증 수행
      const credentials = await signInWithPopup(auth, provider);

      await setDoc(doc(db, "users", credentials.user.uid), {
        email: credentials.user.email,
        displayName: name,
        userType: type,
        createdAt: new Date(),
      });

      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        e.code === "auth/account-exists-with-different-credential"
          ? alert("이미 가입된 이메일입니다.")
          : alert(e.code);
      }
    }
  };

  return (
    <>
      <Types>
        <input onChange={onChange} type="radio" name="type" value="shelter" />
        보호소
        <input onChange={onChange} type="radio" name="type" value="personal" />
        개인
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
  width: 90%;
  margin-top: 10px;
  background-color: white;
  font-size: 1.1rem;
  font-weight: 500;
`;

const Logo = styled.img`
  height: 60%;
`;
