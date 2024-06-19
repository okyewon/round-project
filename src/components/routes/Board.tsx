import styled from "styled-components";
import Posts, { IPost } from "../Board/Posts";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { Button, Form, Input } from "../Map/KakaoMapStyle";
import { IoSearch } from "react-icons/io5";
import React, { createContext, useState } from "react";

export const TypeContext = createContext("all");
export const KeywordContext = createContext("");

const Board = () => {
  const [searchValue, setSearchValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState<IPost["type"]>("all");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value as IPost["type"]);
  };
  const searchPosts = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!searchValue.trim()) {
      alert("내용을 입력해주세요!");
      return;
    } else {
      setKeyword(searchValue);
    }
  };

  return (
    <Wrapper className="container">
      <Contents>
        <Top>
          <Types>
            <Type $isActive={type === "all" ? "true" : "false"}>
              <input
                type="radio"
                name="type"
                value="all"
                checked={type === "all"}
                onChange={onChange}
              />
              전체
            </Type>
            <Type $isActive={type === "shelter" ? "true" : "false"}>
              <input
                type="radio"
                name="type"
                value="shelter"
                checked={type === "shelter"}
                onChange={onChange}
              />
              보호센터
            </Type>
            <Type $isActive={type === "personal" ? "true" : "false"}>
              <input
                type="radio"
                name="type"
                value="personal"
                checked={type === "personal"}
                onChange={onChange}
              />
              개인
            </Type>
          </Types>
          <BoardForm onSubmit={searchPosts}>
            <Input
              type="text"
              value={searchValue}
              id="keyword"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="제목+내용 검색"
            />
            <Button type="submit">
              <IoSearch />
            </Button>
          </BoardForm>
          <Link to="/post-write" className="post-btn">
            글쓰기 <MdEdit />
          </Link>
        </Top>
        <KeywordContext.Provider value={keyword}>
          <TypeContext.Provider value={type}>
            <Posts />
          </TypeContext.Provider>
        </KeywordContext.Provider>
      </Contents>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 120px 0;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
`;

const Types = styled.div`
  display: flex;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const Type = styled.label<{ $isActive: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 100%;
  background-color: ${(props) =>
    props.$isActive === "true" ? "var(--primary-color)" : "#fff"};
  font-size: 1rem;
  color: ${(props) => (props.$isActive === "true" ? "#fff" : "#000")};
  cursor: pointer;

  &:not(:last-child) {
    border-right: 1px solid rgba(0, 0, 0, 0.2);
  }
  input {
    display: none;
  }
`;

const BoardForm = styled(Form)`
  flex-grow: 1;
`;

export default Board;
