import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  getCountFromServer,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { Unsubscribe } from "firebase/auth";
import styled from "styled-components";
import Post from "./Post";

export interface IPost {
  id: string;
  photo?: string;
  title: string;
  post: string;
  userId: string;
  username: string;
  createAt: number;
}

const PAGE_SIZE = 5;

const Posts = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  /* next 버튼에 필요한 상태
    const [lastVisible, setLastVisible] =
      useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  */
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchTotalCount = async () => {
      const collectionRef = collection(db, "posts");
      const snapshot = await getCountFromServer(collectionRef);
      const totalCount = snapshot.data().count;
      setTotalPages(Math.ceil(totalCount / PAGE_SIZE));
    };

    fetchTotalCount();
  }, []);

  const fetchPosts = async (page: number) => {
    setIsLoading(true);
    let postsQuery;

    if (page === 1) {
      postsQuery = query(
        collection(db, "posts"),
        orderBy("createAt", "desc"),
        limit(PAGE_SIZE),
      );
    } else {
      const lastDoc = await getLastVisible(page - 1);
      if (!lastDoc) return;
      postsQuery = query(
        collection(db, "posts"),
        orderBy("createAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE),
      );
    }

    const unsubscribe: Unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => {
        const { title, post, createAt, userId, username, photo } = doc.data();
        return { title, post, createAt, userId, username, photo, id: doc.id };
      });

      setPosts(postsData);
      // setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setIsLoading(false);
    });

    return () => unsubscribe();
  };

  const getLastVisible = async (page: number) => {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createAt", "desc"),
      limit(PAGE_SIZE * page),
    );

    const snapshot = await getDocs(postsQuery);
    return snapshot.docs[snapshot.docs.length - 1];
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Wrapper>
      <PostWrap>
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </PostWrap>
      {isLoading && <p>Loading...</p>}
      <Pagination>
        {Array.from({ length: totalPages }, (_, index) => (
          <PageButton
            key={`${index}`}
            onClick={() => handlePageChange(index + 1)}
            $isActive={page === index + 1}
          >
            {index + 1}
          </PageButton>
        ))}
      </Pagination>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const PostWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-height: 750px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const PageButton = styled.button<{ $isActive: boolean }>`
  padding: 10px 20px;
  background-color: ${(props) =>
    props.$isActive ? "var(--primary-color)" : "#fff"};
  color: ${(props) => (props.$isActive ? "#fff" : "#000")};
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => (props.$isActive ? "transparent" : "#ccc")};
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: ${(props) => {
      if (!props.$isActive) return "#e0e0e0";
    }};
  }
`;

export default Posts;
