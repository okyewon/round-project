import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 550px;
  margin: 100px auto 0;
  padding: 3rem 2rem;
  border-radius: 20px;
  background-color: #eeeeee;
`;

export const Types = styled.div`
  display: flex;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  overflow: hidden;
`;

export const Type = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  padding: 0.8rem 0;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  &:first-child {
    border-right: 1px solid rgba(0, 0, 0, 0.2);
  }
  &:hover,
  &:checked {
    background-color: var(--primary-color);
    color: #fff;
  }
  input {
    display: none;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
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
