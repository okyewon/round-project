import styled from "styled-components";
import {
  Avatar,
  AvatarUpload,
  Email,
  Img,
  MyRoute,
} from "../common/Mypage-components";
import { MdOutlinePets } from "react-icons/md";
import { Link, useOutletContext } from "react-router-dom";
import { MypageProps } from "./Mypage";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaRegEdit } from "react-icons/fa";
import { updateProfile } from "firebase/auth";

const socialLogos: Record<string, string> = {
  password: "",
  "google.com": "/google-logo.svg",
};

const AccountSetting = () => {
  const { avatar, onImgChange, user }: MypageProps = useOutletContext();
  const [social, setSocial] = useState<string[]>([]);
  const [name, setName] = useState<string>(user?.displayName ?? "");
  const [editMode, setEditMode] = useState(false);
  const { providerData } = user;

  useEffect(() => {
    const providerIds = providerData.map((provider) => provider.providerId);
    if (providerData.length > 1) {
      if (social.length === 1 && social[0] === "password") {
        setSocial([]);
      } else {
        setSocial(providerIds.filter((id) => id !== "password"));
      }
    }
  }, [providerData]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onEdit = () => {
    setEditMode(true);
  };

  const onSave = () => {
    setEditMode(false);

    updateProfile(user, {
      displayName: name,
    });
  };

  return (
    <ASRoute>
      <Text>프로필 수정</Text>
      <Account>
        <UserInfo>
          <Avatar htmlFor="avatar">
            <AvatarUpload type="file" id="avatar" onChange={onImgChange} />
            {avatar ? <Img src={avatar} /> : <MdOutlinePets />}
          </Avatar>
          <Info>
            {editMode ? (
              <InputWrap className="name">
                <InputSize>{name}</InputSize>
                <NameInput type="text" value={name} onChange={onChange} />
                <NameSave type="button" onClick={onSave}>
                  <FaCheckCircle />
                </NameSave>
              </InputWrap>
            ) : (
              <Name className="name">
                {name ?? "Anonymous"}{" "}
                <NameEdit type="button" onClick={onEdit}>
                  <FaRegEdit />
                </NameEdit>
              </Name>
            )}
            <Email>{user.email}</Email>
          </Info>
        </UserInfo>
        {user.providerId === "firebase" ? (
          <Link to="/reset-password" className="reset-btn">
            비밀번호 재설정
          </Link>
        ) : (
          ""
        )}
      </Account>
      <Social>
        <Text>연결된 계정</Text>
        <Linked>
          {social.length > 0 ? (
            social.map((item) => {
              const logo = socialLogos[item];
              return logo ? (
                <Logo key={item} src={logo} alt={`${item} logo`} />
              ) : null;
            })
          ) : (
            <Default>연결된 계정이 없습니다.</Default>
          )}
        </Linked>
      </Social>
    </ASRoute>
  );
};

const ASRoute = styled(MyRoute)`
  padding-top: 2rem;
`;

const Account = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 100px;

  .reset-btn {
    padding: 1.2rem;
    background-color: #ccc;
    border-radius: 10px;
    font-weight: 700;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Info = styled.div``;

const InputWrap = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
  font-size: 1.8rem;
`;

const InputSize = styled.span`
  white-space: pre;
  height: 1rem;
  padding: 0 5px;
  opacity: 0;
`;

const NameInput = styled.input`
  position: absolute;
  top: -3px;
  left: 0;
  width: 100%;
  border: none;
  border-bottom: 1px solid #000;
  background-color: transparent;
  &:focus,
  &:active {
    outline: none;
  }
`;

const Name = styled.p`
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: 700;
`;

const NameSave = styled.button`
  position: relative;
  font-size: inherit;
  color: green;
`;

const NameEdit = styled.button`
  font-size: 1.6rem;
`;

const Social = styled.div``;

const Text = styled.p`
  margin-bottom: 2rem;
  font-size: 1.6rem;
  font-weight: 500;
`;

const Linked = styled.div`
  display: flex;
  gap: 20px;
`;

const Logo = styled.img`
  width: 60px;
`;

const Default = styled.p`
  flex-grow: 1;
  font-size: 1.1rem;
  color: #888;
`;

export default AccountSetting;
