import styled from "styled-components";
import { FaBookmark, FaHouseMedical, FaRegTrashCan } from "react-icons/fa6";
import { auth, db, storage } from "../../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { RiEditLine } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import { IPost } from "./Posts";
import { useNavigate } from "react-router";
import { PiPersonArmsSpreadFill } from "react-icons/pi";
import { MdOutlinePets } from "react-icons/md";
import { Img } from "../common/Mypage-components";
import { IoIosMore } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa";
import { FirebaseError } from "firebase/app";

interface IUser {
  createdAt: number;
  displayName: string;
  email: string;
  userType: "shelter" | "personal";
}

const Post = ({ userId, username, photo, title, post, id }: IPost) => {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId || !id) {
    return;
  }
  const dbTextRef = useRef(null);
  const navigator = useNavigate();
  const [avatar, setAvatar] = useState("");
  const [type, setType] = useState<IUser["userType"]>("personal");
  const [more, setMore] = useState(false);
  const [scrap, setScrap] = useState(false);

  useEffect(() => {
    const getAvatarImg = async () => {
      try {
        const locationRef = ref(storage, `avatars/${userId}`);
        const avatarURL = await getDownloadURL(locationRef);
        setAvatar(avatarURL);
      } catch (e) {
        if (
          e instanceof FirebaseError &&
          e.code === "storage/object-not-found"
        ) {
          setAvatar("");
        } else {
          console.log(e);
        }
      }
    };

    const getType = async () => {
      const docSnap = await getDoc(doc(db, "users", userId));
      const { userType } = docSnap.data() as IUser;
      setType(userType);
    };

    const getBookmarks = async () => {
      const userBookmarksCollection = collection(
        db,
        "bookmarks",
        currentUserId,
        "userBookmarks",
      );

      try {
        const q = query(userBookmarksCollection, where("postId", "==", id));
        const querySnapshot = await getDocs(q);
        setScrap(!querySnapshot.empty);
      } catch (e) {
        console.log(e);
      }
    };

    getAvatarImg();
    getType();
    getBookmarks();
  }, []);

  const toggleMore = () => {
    more ? setMore(false) : setMore(true);
  };

  const onDelete = async () => {
    const ok = confirm("게시물을 삭제하시겠어요?");
    if (!ok || currentUserId !== userId) return;
    try {
      await deleteDoc(doc(db, "posts", id));
      if (photo) {
        const photoRef = ref(storage, `posts/${currentUserId}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onEdit = async () => {
    if (currentUserId !== userId) return;
    navigator("/post-write", { state: id });
  };

  const toggleScrap = async () => {
    const userBookmarksCollection = collection(
      db,
      "bookmarks",
      currentUserId,
      "userBookmarks",
    );

    try {
      const q = query(userBookmarksCollection, where("postId", "==", id));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        setScrap(false);
      } else {
        await addDoc(userBookmarksCollection, {
          postId: id,
        });
        setScrap(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper className="post-item">
      <Column className="texts">
        <UserInfo>
          {type === "shelter" ? (
            <UserType className="blue">
              <FaHouseMedical /> 보호센터
            </UserType>
          ) : (
            <UserType className="pink">
              <PiPersonArmsSpreadFill /> 개인
            </UserType>
          )}
          <User>
            <Avatar>{avatar ? <Img src={avatar} /> : <MdOutlinePets />}</Avatar>
            <Username>{username}</Username>
          </User>
        </UserInfo>
        <Title>{title}</Title>
        <Payload ref={dbTextRef} id="post">
          {post}
        </Payload>
      </Column>
      {currentUserId === userId ? (
        <More onClick={toggleMore} className={more ? "on" : ""}>
          <IoIosMore />
          <UserButtons className="user-btns">
            <UserButton className="edit" onClick={onEdit} type="button">
              <RiEditLine />
              수정하기
            </UserButton>
            <UserButton className="delete" onClick={onDelete} type="button">
              <FaRegTrashCan />
              삭제하기
            </UserButton>
          </UserButtons>
        </More>
      ) : (
        <BookmarkBtn onClick={toggleScrap}>
          {scrap ? <FaBookmark /> : <FaRegBookmark />}
        </BookmarkBtn>
      )}
      {/* {photo ? (
        <Column className="photo">
          <Photo src={photo} />
        </Column>
      ) : null} */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;
  width: 100%;
  padding: 20px;
  border: 1px solid rgba(207, 207, 207, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &.texts {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.5rem;
    width: calc(100% - 50px);
    min-height: 100px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const UserType = styled.div`
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

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Avatar = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  font-size: 1rem;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 1rem;
`;

const Title = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
`;

const Payload = styled.p`
  width: calc(100% - 130px);
  margin: 0;
  font-size: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const More = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
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

const UserButtons = styled.div`
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

const UserButton = styled.button`
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

const BookmarkBtn = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6rem;
  cursor: pointer;
  color: var(--primary-color);
`;

// const Photo = styled.img`
//   width: 100px;
//   height: 100px;
//   border-radius: 15px;
//   object-fit: cover;
// `;

export default Post;
