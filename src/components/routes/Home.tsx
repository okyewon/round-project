import styled from "styled-components";
import { auth } from "../../firebase";
import { MdGpsFixed } from "react-icons/md";
import { IoSearch } from "react-icons/io5";

const Home = () => {
  const name = auth.currentUser?.displayName;
  return (
    <Wrapper>
      <Title>
        안녕하세요👋, {name} 님! <br />
        댕냥이들 보러 가볼까요~?🐶🐱
      </Title>
      <InputWrap>
        <Input
          className="search"
          type="text"
          placeholder="지역을 입력해주세요."
        />
        <Button type="submit">
          <IoSearch />
        </Button>
      </InputWrap>
      <Around className="search">
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

const InputWrap = styled.div`
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
`;

export default Home;
