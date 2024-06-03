import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import styled from "styled-components";
import { UserType } from "../routes/CreateAccount";
import { useNavigate } from "react-router";
import { auth, db } from "../../firebase";

const TypeModal = () => {
  const [type, setType] = useState<UserType>("personal");
  const navigate = useNavigate();
  const user = auth.currentUser;
  if (!user) return;

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "shelter" || value === "personal") setType(value);
  };

  const handleSubmit = async () => {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: user.displayName,
      userType: type,
      createdAt: new Date(),
    });
    navigate("/home", { replace: true });
  };

  return (
    <Wrapper>
      <Modal>
        <input
          id="shelter"
          onChange={handleTypeChange}
          type="radio"
          name="type"
          value="shelter"
        />
        <Type htmlFor="shelter">보호센터</Type>
        <input
          id="personal"
          onChange={handleTypeChange}
          type="radio"
          name="type"
          value="personal"
        />
        <Type htmlFor="personal">개인</Type>
        <Button onClick={handleSubmit} className="btn">
          확인
        </Button>
      </Modal>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 100%;
  max-width: 550px;
  padding: 3rem 2rem;
  border-radius: 20px;
  background-color: #eeeeee;
  input {
    display: none;
  }
`;

const Type = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.8rem 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background-color: #fff;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: rgba(172, 172, 172, 0.1);
  }
  input:checked + & {
    background-color: var(--primary-color);
    color: #fff;
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  font-size: 1.1rem;
  font-weight: 500;
  color: #fff;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.1);
`;

export default TypeModal;
