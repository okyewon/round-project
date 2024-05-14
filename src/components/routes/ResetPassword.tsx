import { useState } from "react";
import { useNavigate } from "react-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { Button, Form, Input, Wrapper } from "../common/Auth-components";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading || email === "") return;
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      alert("이메일이 전송되었습니다. 메일함을 확인해주세요!");
      navigate("/");
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <h2 className="text-4xl font-bold">비밀번호 재설정</h2>
      <p className="mt-4">작성된 이메일로 안내 링크가 전송됩니다.</p>
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
        <Button type="submit" className="btn text-2xl font-bold">
          {isLoading ? "Loading..." : "Send Email"}
        </Button>
      </Form>
    </Wrapper>
  );
};

export default Login;
