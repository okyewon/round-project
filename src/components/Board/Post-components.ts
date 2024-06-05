import styled from "styled-components";

export const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const UserType = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0.3rem;
  border-radius: 5px;
  font-size: 1rem;
  color: #666;
  &.blue {
    background-color: #def2ff;
  }
  &.pink {
    background-color: #ffdee3;
  }
`;

export const User = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const Avatar = styled.div`
  overflow: hidden;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  font-size: 1rem;
`;

export const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 50%;
`;

export const Username = styled.span`
  font-weight: 600;
  font-size: 1rem;
`;

export const More = styled.div`
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 40px;
  cursor: pointer;
  &.on {
    .user-btns {
      transform: scale(1);
    }
  }
`;

export const UserButtons = styled.div`
  display: grid;
  position: absolute;
  top: 100%;
  right: 0;
  grid-template-columns: max-content;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  transform: scale(0);
  transform-origin: 70% top;
  transition: all 0.3s;
`;

export const UserButton = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border: 0;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;

  &.delete {
    border-top: 1px solid #ccc;
    color: orangered;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export const BookmarkBtn = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6rem;
  cursor: pointer;
  color: var(--primary-color);
`;
