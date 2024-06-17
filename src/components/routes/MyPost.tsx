import { useOutletContext } from "react-router";
import {
  Contents,
  MyRoute,
  Text,
  Title,
  Top,
} from "../common/Mypage-components";
import { MypageProps } from "./Mypage";
import Post from "../Board/Post";
import { useEffect, useState } from "react";
import { Unsubscribe } from "firebase/auth";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { IPost } from "../Board/Posts";

const Mypost = () => {
  const { user }: MypageProps = useOutletContext();
  const [myPosts, setMyPosts] = useState<IPost[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      if (!user) return;
      const myPostQuery = query(
        collection(db, "posts"),
        where("userId", "==", user.uid),
        orderBy("createAt", "desc"),
        limit(15),
      );

      unsubscribe = await onSnapshot(myPostQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          const { title, post, createAt, userId, username, photo, type } =
            doc.data() as IPost;
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
        setMyPosts(posts);
        setTotal(posts.length);
      });
    };

    if (user) {
      fetchTweets();
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [user]);
  return (
    <MyRoute>
      <Top>
        <Title>{user.displayName}님의 게시물</Title>
        <Text>총 {total}개의 게시물을 작성하셨어요 😎</Text>
      </Top>
      <Contents>
        {myPosts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </Contents>
    </MyRoute>
  );
};

export default Mypost;
