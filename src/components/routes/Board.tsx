import styled from "styled-components";
import Posts from "../Board/Posts";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";

const Board = () => {
  return (
    <Wrapper className="container">
      <Filter></Filter>
      <Contents>
        <Link to="/post-write" className="post-btn">
          글쓰기 <MdEdit />
        </Link>
        <Posts />
      </Contents>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  padding: 120px 0;
`;

const Filter = styled.div`
  background-color: #ccc;
`;

const Contents = styled.div`
  grid-column: span 3;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
  width: 100%;

  .post-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    background-color: var(--primary-color);
    font-size: 1.2rem;
    font-weight: 500;
    color: #fff;
  }
`;

export default Board;
