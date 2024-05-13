import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { FirebaseError } from "firebase/app";
import { errorMessage } from "../constants/constants";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await updateProfile(credentials.user, {
        displayName: name,
      });

      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        if (
          e.code === "auth/email-already-in-use" ||
          e.code === "auth/weak-password"
        ) {
          setError(errorMessage[e.code]);
        } else {
          setError(e.code);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <h2 className="text-4xl font-bold">로그인</h2>
      <Form onSubmit={onSubmit}>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <Input
            onChange={onChange}
            type="email"
            name="email"
            className="grow"
            value={email}
            placeholder="이메일"
            required
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <Input
            onChange={onChange}
            type="password"
            name="password"
            className="grow"
            value={password}
            placeholder="비밀번호"
            required
          />
        </label>
        <Button type="submit" className="btn text-2xl font-bold">
          {isLoading ? "Loading..." : "Join in !"}
        </Button>
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 550px;
  margin: 100px auto 0;
  padding: 3rem 0;
  border-radius: 20px;
  background-color: #eeeeee;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 90%;
  margin-top: 50px;
`;

const Input = styled.input`
  background-color: transparent !important;
  &:-internal-autofill-selected {
    background-color: transparent !important;
  }
`;

const Button = styled.button`
  background-color: #2f2f2f;
  color: #fff;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export default Login;
