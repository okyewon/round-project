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

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 90%;
  margin-top: 50px;
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

export const Switcher = styled.span`
  margin-top: 20px;
  a {
    color: #1d9bf0;
    text-decoration: none;
  }
`;
