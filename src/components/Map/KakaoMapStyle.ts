import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;

  a,
  a:hover,
  a:active {
    color: #000;
  }
`;

export const SearchWrap = styled.div`
  z-index: 1;
  overflow-y: auto;
  position: absolute;
  top: 80px;
  left: 10px;
  bottom: 0;
  width: 330px;
  margin: 0 0 30px 0;
  padding: 5px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
`;

export const SelectForm = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 1rem;
`;

export const Form = styled.form`
  position: relative;
  font-size: 1rem;
`;

export const Select = styled.select`
  flex-grow: 1;
  padding: 15px 20px;
  border-radius: inherit;
  background-color: transparent;
  &:focus,
  &:active {
    outline: none;
  }
  option {
    background-color: #efefef;
    font-size: 1.1rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 2.5rem;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.5);
`;

export const Button = styled.button`
  position: absolute;
  top: 0;
  right: 1rem;
  height: 100%;
  vertical-align: middle;
  font-size: 1.4rem;
  &:focus {
    outline: none;
  }
`;

export const SelectButton = styled.button`
  padding: 0 20px;
  font-size: 1.4rem;
  &:focus-visible {
    outline: none;
  }
`;

export const List = styled.ul`
  margin-top: 5px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  background-color: rgba(255, 255, 255, 0.6);

  .item {
    overflow: hidden;
    position: relative;
    min-height: 65px;
    border-bottom: 1px solid #888;
    cursor: pointer;

    &:last-child {
      border-bottom: none;
    }

    span {
      display: block;
      margin-top: 4px;
    }

    h5,
    .info {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .info {
      padding: 10px 0 10px 55px;

      .gray {
        color: #8a8a8a;
      }

      .jibun {
        padding-left: 26px;
        background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_jibun.png)
          no-repeat;
      }

      .tel {
        color: #009900;
      }
    }

    .markerbg {
      float: left;
      position: absolute;
      width: 36px;
      height: 37px;
      margin: 10px 0 0 10px;
      background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png)
        no-repeat;
    }
    .marker_1 {
      background-position: 0 -10px;
    }
    .marker_2 {
      background-position: 0 -56px;
    }
    .marker_3 {
      background-position: 0 -102px;
    }
    .marker_4 {
      background-position: 0 -148px;
    }
    .marker_5 {
      background-position: 0 -194px;
    }
    .marker_6 {
      background-position: 0 -240px;
    }
    .marker_7 {
      background-position: 0 -286px;
    }
    .marker_8 {
      background-position: 0 -332px;
    }
    .marker_9 {
      background-position: 0 -378px;
    }
    .marker_10 {
      background-position: 0 -423px;
    }
    .marker_11 {
      background-position: 0 -470px;
    }
    .marker_12 {
      background-position: 0 -516px;
    }
    .marker_13 {
      background-position: 0 -562px;
    }
    .marker_14 {
      background-position: 0 -608px;
    }
    .marker_15 {
      background-position: 0 -654px;
    }
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin: 10px auto;
  text-align: center;

  a {
    display: inline-block;
    width: 25px;
    height: 25px;
    padding-top: 2px;
    border: 1px solid #000;
    border-radius: 5px;
    background-color: #fff;
    font-size: 1rem;

    &.on {
      background-color: #00d6f3;
      border-color: #00d6f3;
      font-weight: 700;
      color: #fff;
      cursor: default;
    }
  }
`;
