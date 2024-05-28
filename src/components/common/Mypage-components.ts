import styled from "styled-components";

export const Avatar = styled.label`
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  cursor: pointer;
`;

export const AvatarUpload = styled.input`
  display: none;
`;

export const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Name = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
`;

export const Email = styled.p`
  font-size: 1rem;
`;

export const MyRoute = styled.div`
  grid-column: span 3;
  padding: 0 2rem;
`;

export const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 0;
`;

export const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 500;
`;

export const Text = styled.p`
  font-size: 1.2rem;
  color: #848484;
`;

export const Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
