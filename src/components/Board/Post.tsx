import styled from "styled-components";
import { FaHouseMedical, FaRegTrashCan } from "react-icons/fa6";
import { auth, db, storage } from "../../firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { RiEditLine } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IPost } from "./Posts";
import { useNavigate } from "react-router";
import { PiPersonArmsSpreadFill } from "react-icons/pi";

interface IUser {
  createdAt: number;
  displayName: string;
  email: string;
  userType: "shelter" | "personal";
}

const Post = ({ userId, username, photo, post, id }: IPost) => {
  const user = auth.currentUser?.uid;
  const dbTextRef = useRef(null);
  const editTextRef = useRef(null);
  const navigator = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [text, setText] = useState(post);
  const [type, setType] = useState<IUser["userType"]>("personal");

  useEffect(() => {
    const getType = async () => {
      const docSnap = await getDoc(doc(db, "users", userId));
      const { userType } = docSnap.data() as IUser;
      setType(userType);
    };

    getType();
  }, []);

  const onDelete = async () => {
    const ok = confirm("게시물을 삭제하시겠어요?");
    if (!ok || user !== userId) return;
    try {
      await deleteDoc(doc(db, "posts", id));
      if (photo) {
        const photoRef = ref(storage, `posts/${user}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onEdit = async () => {
    if (user !== userId) return;

    navigator("/post-write", { state: id });
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const saveEdit = async () => {
    try {
      await updateDoc(doc(db, "posts", id), {
        post: text,
      });
      setEditMode(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <Column className="texts">
        <User>
          {type === "shelter" ? <FaHouseMedical /> : <PiPersonArmsSpreadFill />}
          <Username>{username}</Username>
        </User>
        {editMode ? (
          <EditText
            ref={editTextRef}
            id="edit-tweet"
            required
            rows={3}
            maxLength={350}
            onChange={onChange}
            value={text}
          ></EditText>
        ) : (
          <Payload ref={dbTextRef} id="post">
            {post}
          </Payload>
        )}
        {user === userId ? (
          <UserButtons>
            {editMode ? (
              <UserButton className="save" onClick={saveEdit} type="button">
                <FaCheck />
              </UserButton>
            ) : (
              <UserButton className="edit" onClick={onEdit} type="button">
                <RiEditLine />
              </UserButton>
            )}
            <UserButton className="delete" onClick={onDelete} type="button">
              <FaRegTrashCan />
            </UserButton>
          </UserButtons>
        ) : null}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 20px;
  border: 1px solid rgba(207, 207, 207, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &.texts {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
  }
`;

const User = styled.div`
  display: flex;
  gap: 5px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 1rem;
`;

const Payload = styled.p`
  display: -webkit-inline-box;
  flex: 1;
  width: 100%;
  margin: 0;
  font-size: 1rem;
  word-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const EditText = styled.textarea`
  width: 100%;
  padding: 20px;
  border: 1px solid yellow;
  border-radius: 10px;
  background-color: #000;
  font-size: 1rem;
  color: white;
  resize: none;
  &:focus {
    outline: none;
  }
`;

const UserButtons = styled.div`
  display: flex;
  gap: 5px;
`;

const UserButton = styled.button`
  padding: 5px 10px;
  border: 0;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;

  &.edit {
    background-color: #77ff00;
  }

  &.delete {
    background-color: orangered;
    color: #fff;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  object-fit: cover;
`;

export default Post;
