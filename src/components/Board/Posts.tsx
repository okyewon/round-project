import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { Unsubscribe } from "firebase/auth";
import styled from "styled-components";
import Post from "./Post";

export interface IPost {
  id: string;
  photo?: string;
  post: string;
  userId: string;
  username: string;
  createAt: number;
}

const Posts = () => {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchTweets = async () => {
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createAt", "desc"),
        limit(25),
      );

      // onSnapshot이 구독 취소 함수를 반환
      unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          const { post, createAt, userId, username, photo } = doc.data();
          return { post, createAt, userId, username, photo, id: doc.id };
        });

        setPosts(posts);
      });
    };

    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper className="container">
      <Filter></Filter>
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 120px;
`;

const Filter = styled.div``;

export default Posts;
