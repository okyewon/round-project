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
import {
  StorageReference,
  deleteObject,
  getDownloadURL,
  ref,
} from "firebase/storage";
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
import { Link } from "react-router-dom";
import {
  Avatar,
  BookmarkBtn,
  Icon,
  More,
  User,
  UserButton,
  UserButtons,
  UserInfo,
  UserType,
  Username,
} from "./Post-components";

export interface IUser {
  createdAt: number;
  displayName: string;
  email: string;
  userType: "shelter" | "personal";
  photoURL?: string;
}

const Post = ({ userId, username, photo, title, post, type, id }: IPost) => {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId || !id) {
    return;
  }
  const dbTextRef = useRef(null);
  const navigator = useNavigate();
  const [avatar, setAvatar] = useState("");
  const [more, setMore] = useState(false);
  const [scrap, setScrap] = useState(false);

  useEffect(() => {
    const getAvatarImg = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      const { photoURL } = docSnap.data() as IUser;
      if (photoURL) {
        setAvatar(photoURL);
      }
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
    getBookmarks();
  }, [userId, id]);

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
            <Avatar>
              {avatar ? (
                <Img src={avatar} />
              ) : (
                <Icon>
                  <MdOutlinePets />
                </Icon>
              )}
            </Avatar>
            <Username>{username}</Username>
          </User>
        </UserInfo>
        <Title>{title}</Title>
        <Payload ref={dbTextRef} id="post">
          {post}
        </Payload>
      </Column>
      <DetailLink to={`/post-detail/${id}`}></DetailLink>
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
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.1);
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

const DetailLink = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export default Post;
