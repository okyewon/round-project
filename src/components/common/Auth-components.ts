import styled from "styled-components";

export const Wrapper = styled.div`
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

export const Types = styled.div``;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 90%;
  margin-top: 30px;
`;

export const Input = styled.input`
  background-color: transparent !important;
  &:-internal-autofill-selected {
    background-color: transparent !important;
  }
`;

export const Button = styled.button`
  background-color: #2f2f2f;
  color: #fff;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

export const Error = styled.span`
  margin: 10px;
  font-weight: 600;
  color: tomato;
`;

export const Or = styled.p`
  position: relative;
  width: 90%;
  margin: 1.5rem auto 1rem;
  font-size: 1rem;
  color: gray;
  text-align: center;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: calc(50% - 2rem);
    height: 1px;
    background-color: #ccc;
  }

  &::before {
    left: 0;
  }
  &::after {
    right: 0;
  }
`;

export const Switcher = styled.span`
  margin-top: 20px;
  a {
    color: #1d9bf0;
    text-decoration: none;
  }
`;
