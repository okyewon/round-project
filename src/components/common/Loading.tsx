import { styled } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Text = styled.span`
  font-size: 1.5rem;
`;

const Loading = () => {
  return (
    <Wrapper>
      <Text className="font-bold">Loading...</Text>
    </Wrapper>
  );
};

export default Loading;
