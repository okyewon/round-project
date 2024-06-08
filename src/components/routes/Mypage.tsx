import { Outlet, useNavigate } from "react-router";
import { auth, db, storage } from "../../firebase";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { IPost } from "../Board/Posts";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Unsubscribe, User, updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { MdOutlinePets } from "react-icons/md";
import {
  Avatar,
  AvatarUpload,
  Email,
  Img,
  Name,
} from "../common/Mypage-components";

export interface MypageProps {
  user: User;
  avatar: string | null;
  name: string;
  posts: IPost[];
  onImgChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const Mypage = () => {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [name, setName] = useState<string>(user?.displayName ?? "");
  const navigate = useNavigate();
  //todo: name 실시간 감지

  const onImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const maxSize = 2 * 1024 * 1024;
    if (!user) return;

    if (files && files.length === 1) {
      const file = files[0];
      if (file && file.size > maxSize) {
        alert("파일은 2MB 이하로 올려주세요 !");
        return;
      }
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const imgURL = await getDownloadURL(result.ref);

      setAvatar(imgURL);
      await updateProfile(user, {
        photoURL: imgURL,
      });
      await updateDoc(doc(db, "users", user.uid), {
        photoURL: imgURL,
      });
    }
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createAt", "desc"),
        limit(25),
      );

      // onSnapshot이 구독 취소 함수를 반환
      unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
        const posts: IPost[] = snapshot.docs.map((doc) => {
          const { title, post, createAt, userId, username, photo, type } =
            doc.data();
          return {
            title,
            post,
            createAt,
            userId,
            username,
            photo,
            type,
            id: doc.id,
          };
        });

        setPosts(posts);
      });
    };

    fetchPosts();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  const logOut = async () => {
    const ok = confirm("로그아웃 하시겠어요?");
    if (ok) {
      await auth.signOut();
      navigate("/login");
    }
  };

  return (
    <Wrapper className="container">
      <Aside>
        <UserInfo>
          <Avatar htmlFor="avatar">
            <AvatarUpload type="file" id="avatar" onChange={onImgChange} />
            {avatar ? <Img src={avatar} /> : <MdOutlinePets />}
          </Avatar>
          <Name>{name}</Name>
          <Email>{user?.email}</Email>
        </UserInfo>
        <Menu>
          <Lists>
            <NavLink
              to="/mypage/bookmark"
              className={({ isActive }) => (isActive ? "on" : "")}
            >
              🤗 북마크
            </NavLink>
            <NavLink
              to="/mypage/my-post"
              className={({ isActive }) => (isActive ? "on" : "")}
            >
              😻 나의 게시물
            </NavLink>
            <NavLink
              to="/mypage/account-setting"
              className={({ isActive }) => (isActive ? "on" : "")}
            >
              ⚙️ 계정 설정
            </NavLink>
          </Lists>
          <LogOut className="btn" onClick={logOut}>
            로그 아웃
          </LogOut>
        </Menu>
      </Aside>
      <Outlet context={{ user, avatar, posts, onImgChange }} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  width: 100%;
  height: 90vh;
  padding: 90px 0;
`;

const Aside = styled.div`
  grid-column: span 1;
  display: grid;
  grid-template-rows: max-content auto;
  min-height: 720px;
  border-radius: 1rem;
  background-color: #fff;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 60px 0;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px 30px;
  height: 100%;

  a {
    font-size: 1.2rem;
    transition: transform 0.2s;
  }
  a:hover,
  a.on {
    transform: translateX(12px);
  }
`;

const Lists = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  a {
    font-size: 1.4rem;
    font-weight: 500;
  }
`;

const LogOut = styled.button``;

export default Mypage;
