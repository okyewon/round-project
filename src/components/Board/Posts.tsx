import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  getCountFromServer,
  getDocs,
  where,
  or,
  and,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { Unsubscribe } from "firebase/auth";
import styled from "styled-components";
import Post from "./Post";
import { KeywordContext, TypeContext } from "../routes/Board";

export interface IPost {
  id: string;
  photo?: string;
  title: string;
  post: string;
  userId: string;
  username: string;
  createAt: number;
  type: "all" | "shelter" | "personal";
}

const PAGE_SIZE = 5;

const Posts = () => {
  const type = useContext(TypeContext);
  const keyword = useContext(KeywordContext);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchTotalCount = async () => {
      setIsLoading(true);
      try {
        const collectionRef = collection(db, "posts");
        let q;
        let snapshot;

        if (type !== "all" && keyword) {
          q = query(
            collectionRef,
            and(
              where("type", "==", type),
              or(
                and(
                  where("title", ">=", keyword),
                  where("title", "<=", keyword + "\uf8ff"),
                ),
                and(
                  where("post", ">=", keyword),
                  where("post", "<=", keyword + "\uf8ff"),
                ),
              ),
            ),
          );
        } else if (type !== "all") {
          q = query(collectionRef, where("type", "==", type));
        } else if (keyword) {
          q = query(
            collectionRef,
            or(
              and(
                where("title", ">=", keyword),
                where("title", "<=", keyword + "\uf8ff"),
              ),
              and(
                where("post", ">=", keyword),
                where("post", "<=", keyword + "\uf8ff"),
              ),
            ),
          );
        }

        if (!q) {
          //문서를 다운로드하기 전, 개수 count
          snapshot = await getCountFromServer(collectionRef);
        } else {
          snapshot = await getCountFromServer(q);
        }
        const totalCount = snapshot.data().count;
        setTotalPages(Math.ceil(totalCount / PAGE_SIZE));
      } catch (error) {
        console.error();
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalCount();
  }, [keyword, type]);

  const fetchPosts = async (page: number) => {
    setIsLoading(true);
    let postsQuery;

    if (page === 1) {
      if (type !== "all") {
        if (keyword) {
          postsQuery = query(
            collection(db, "posts"),
            and(
              where("type", "==", type),
              or(
                and(
                  where("title", ">=", keyword),
                  where("title", "<=", keyword + "\uf8ff"),
                ),
                and(
                  where("post", ">=", keyword),
                  where("post", "<=", keyword + "\uf8ff"),
                ),
              ),
            ),
            orderBy("createAt", "desc"),
            limit(PAGE_SIZE),
          );
        } else {
          postsQuery = query(
            collection(db, "posts"),
            where("type", "==", type),
            orderBy("createAt", "desc"),
            limit(PAGE_SIZE),
          );
        }
      } else {
        if (keyword) {
          postsQuery = query(
            collection(db, "posts"),
            or(
              and(
                where("title", ">=", keyword),
                where("title", "<=", keyword + "\uf8ff"),
              ),
              and(
                where("post", ">=", keyword),
                where("post", "<=", keyword + "\uf8ff"),
              ),
            ),
            orderBy("createAt", "desc"),
            limit(PAGE_SIZE),
          );
        } else {
          postsQuery = query(
            collection(db, "posts"),
            orderBy("createAt", "desc"),
            limit(PAGE_SIZE),
          );
        }
      }
    } else {
      const lastDoc = await getLastVisible(page - 1);
      if (!lastDoc) return;
      if (type !== "all") {
        postsQuery = query(
          collection(db, "posts"),
          where("type", "==", type),
          orderBy("createAt", "desc"),
          startAfter(lastDoc),
          limit(PAGE_SIZE),
        );
      } else {
        postsQuery = query(
          collection(db, "posts"),
          orderBy("createAt", "desc"),
          startAfter(lastDoc),
          limit(PAGE_SIZE),
        );
      }
    }

    const unsubscribe: Unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs
        .map((doc) => {
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
        })
        .filter((doc) => {
          if (type === "all") return true;
          return doc.type === type;
        });

      setPosts(postsData);
      // setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setIsLoading(false);
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page, type, keyword]);

  const getLastVisible = async (page: number) => {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createAt", "desc"),
      limit(PAGE_SIZE * page),
    );

    const snapshot = await getDocs(postsQuery);
    return snapshot.docs[snapshot.docs.length - 1];
  };

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
