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
import styled from "styled-components";
import { auth, db, storage } from "../../firebase";
import { IPost } from "../Board/Posts";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
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
} from "../Board/Post-components";
import {
  FaBookmark,
  FaHouseMedical,
  FaRegBookmark,
  FaRegTrashCan,
} from "react-icons/fa6";
import { PiPersonArmsSpreadFill } from "react-icons/pi";
import { Img } from "../common/Mypage-components";
import { MdOutlinePets } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import { RiEditLine } from "react-icons/ri";
import { deleteObject, ref } from "firebase/storage";
import { useNavigate, useParams } from "react-router";
import { Input } from "../Map/KakaoMapStyle";
import { IUser } from "../Board/Post";
import { BsFillSendFill } from "react-icons/bs";

interface CommentType {
  username: string;
  avatarURL: string;
  comment: string;
  createAt: number;
}

const PostDetail = () => {
  const { postId } = useParams();
  const navigator = useNavigate();
  const [postData, setPostData] = useState<IPost>();
  const [more, setMore] = useState(false);
  const [scrap, setScrap] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [total, setTotal] = useState(0);
  const [value, setValue] = useState("");
  const currentUser = auth.currentUser;
  if (!currentUser || !postId) {
    return;
  }

  const fetchPost = useMemo(
    () => async () => {
      const docSnap = await getDoc(doc(db, "posts", postId.toString()));
      const data = docSnap.data() as IPost;
      return { ...data, id: docSnap.id };
    },
    [postId],
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchPost();
        setPostData(data);
        return data;
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [fetchPost]);

  const getAvatarImg = useMemo(
    () => async () => {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      const { photoURL } = docSnap.data() as IUser;
      if (photoURL) {
        setAvatar(photoURL);
      }
    },
    [currentUser.uid],
  );

  const getBookmarks = useCallback(async () => {
    const userBookmarksCollection = collection(
      db,
      "bookmarks",
      currentUser.uid,
      "userBookmarks",
    );

    try {
      const q = query(userBookmarksCollection, where("postId", "==", postId));
      const querySnapshot = await getDocs(q);
      setScrap(!querySnapshot.empty);
    } catch (e) {
      console.log(e);
    }
  }, [currentUser.uid, postId]);

  useEffect(() => {
    getAvatarImg();
    getBookmarks();
  }, [getAvatarImg, getBookmarks]);

  const getComments = useCallback(async () => {
    try {
      const commentCollectionRef = collection(db, `posts/${postId}/comments`);
      const commentSnap = await getDocs(commentCollectionRef);
      const newComments = commentSnap.docs.map(
        (doc) => doc.data() as CommentType,
      );
      const commentsChanged =
        JSON.stringify(comments) !== JSON.stringify(newComments);

      if (commentsChanged) {
        setComments(newComments);
        setTotal(commentSnap.docs.length);
      }
    } catch (error) {
      console.log(error);
    }
  }, [postId, comments]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  if (!postData) {
    return <div>Loading...</div>;
  }

  const { type, username, title, photo, userId, post, id } = postData;

  const toggleMore = () => {
    more ? setMore(false) : setMore(true);
  };

  const onDelete = async () => {
    const ok = confirm("게시물을 삭제하시겠어요?");
    if (!ok || currentUser.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "posts", id));
      if (photo) {
        const photoRef = ref(storage, `posts/${currentUser.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onEdit = async () => {
    if (currentUser.uid !== userId) return;
    navigator("/post-write", { state: id });
  };

  const toggleScrap = async () => {
    const userBookmarksCollection = collection(
      db,
      "bookmarks",
      currentUser.uid,
      "userBookmarks",
    );

    try {
      const q = query(userBookmarksCollection, where("postId", "==", postId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        setScrap(false);
      } else {
        await addDoc(userBookmarksCollection, {
          postId,
        });
        setScrap(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const commentCollectionRef = collection(db, `posts/${postId}/comments`);
      await addDoc(commentCollectionRef, {
        username: currentUser.displayName || "Anonymous",
        avatarURL: currentUser.photoURL,
        comment: value,
        createAt: Date.now(),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setValue("");
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <Wrapper className="container">
      <Detail>
        <Row>
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
        </Row>
        {currentUser.uid === userId ? (
          <DetailMore onClick={toggleMore} className={more ? "on" : ""}>
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
          </DetailMore>
        ) : (
          <DetailBtn onClick={toggleScrap}>
            {scrap ? <FaBookmark /> : <FaRegBookmark />}
          </DetailBtn>
        )}
        <Payload id="post" style={{ whiteSpace: "pre-wrap" }}>
          {post}
          {photo ? (
            <PhotoBox className="photo">
              <Photo src={photo} />
            </PhotoBox>
          ) : null}
        </Payload>
        <Comments>
          <CmTitle>댓글 {total}개</CmTitle>
          {comments.map((comment, idx) => (
            <Comment key={`${idx}`}>
              <CmAvatar>
                {comment.avatarURL ? (
                  <Img src={comment.avatarURL} />
                ) : (
                  <Icon>
                    <MdOutlinePets />
                  </Icon>
                )}
              </CmAvatar>
              <Column>
                <Username>{comment.username}</Username>
                <CmText>{comment.comment}</CmText>
              </Column>
            </Comment>
          ))}
          <CmPost>
            <CmAvatar>
              {avatar ? (
                <Img src={avatar} />
              ) : (
                <Icon>
                  <MdOutlinePets />
                </Icon>
              )}
            </CmAvatar>
            <InputWrap onSubmit={handleSubmit}>
              <CmInput type="text" value={value} onChange={onChange} />
              <PostIcon type="submit">
                <BsFillSendFill />
              </PostIcon>
            </InputWrap>
          </CmPost>
        </Comments>
      </Detail>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 100vh;
  padding: 100px 0;
`;

const Detail = styled.div`
  position: relative;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  width: 70%;
  border-radius: 20px;
  border: 2px solid #efefef;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.1);
`;

const Row = styled.div`
  max-width: calc(100% - 50px);
  padding: 2rem;
`;

const Title = styled.h2`
  margin-top: 0.8rem;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
`;

const DetailMore = styled(More)`
  top: 1.5rem;
  right: 1.5rem;
`;

const DetailBtn = styled(BookmarkBtn)`
  top: 2rem;
  right: 2rem;
`;

const Payload = styled.div`
  padding: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  font-size: 1.1rem;
  line-height: 1.8;
`;

const PhotoBox = styled.div`
  position: relative;
  width: 70%;
  padding-top: 70%;
  margin-top: 2rem;
`;

const Photo = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Comments = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
`;

const CmTitle = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
`;

const CmPost = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const Comment = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed rgba(0, 0, 0, 0.2);
`;

const CmAvatar = styled.div`
  overflow: hidden;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  font-size: 2rem;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CmText = styled.div`
  white-space: pre-wrap;
`;

const InputWrap = styled.form`
  position: relative;
  flex-grow: 1;
`;

const CmInput = styled(Input)`
  border: 1px solid rgba(0, 0, 0, 0.2);
`;

const PostIcon = styled.button`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  font-size: 1.3rem;
  color: var(--primary-color);
`;

export default PostDetail;
