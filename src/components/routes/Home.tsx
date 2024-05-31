import styled from "styled-components";
import { auth } from "../../firebase";
import { MdGpsFixed } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router";
import { SyntheticEvent, useState } from "react";

const Home = () => {
  const name = auth.currentUser?.displayName;
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    navigate("/map", { state: { keyword: value } });
  };

  const handleNearbySearch = () => {
    navigate("/map", { state: { nearby: true } });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <Wrapper>
      <Title>
        안녕하세요👋, {name} 님! <br />
        댕냥이들 보러 가볼까요~?🐶🐱
      </Title>
      <Form onSubmit={handleSubmit}>
        <Input
          className="search"
          type="text"
          placeholder="지역 or 보호소명"
          onChange={onChange}
          value={value}
        />
        <Button type="submit">
          <IoSearch />
        </Button>
      </Form>
      <Around className="search" onClick={handleNearbySearch}>
        <MdGpsFixed />내 주변 검색
      </Around>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;

  .search {
    width: 400px;
    height: 60px;
    border-radius: 16px;
  }
`;

const Title = styled.h2`
  margin-bottom: 50px;
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.6;
`;

const Form = styled.form`
  position: relative;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 15px 50px 15px 15px;
  border: 2px solid #003e46;
`;

const Button = styled.button`
  position: absolute;
  top: 50%;
  right: 20px;
  font-size: 1.5rem;
  transform: translateY(-50%);
`;

const Around = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: var(--primary-color);
  font-size: 1.5rem;
  color: #fff;
  box-shadow: inset 0 0 1rem rgba(11, 0, 128, 0.3);
`;

export default Home;
