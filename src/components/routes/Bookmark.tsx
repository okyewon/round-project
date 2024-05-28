import { collection, onSnapshot } from "firebase/firestore";
import {
  Contents,
  MyRoute,
  Text,
  Title,
  Top,
} from "../common/Mypage-components";
import { MypageProps } from "./Mypage";
import { useOutletContext } from "react-router";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { Unsubscribe } from "firebase/auth";
import Post from "../Board/Post";
import { IPost } from "../Board/Posts";

interface Bookmark {
  postId: string;
}

const Bookmark = () => {
  const { user, posts }: MypageProps = useOutletContext();
  const [bookmarks, setBookmarks] = useState<IPost[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchBookmarks = async () => {
      const userBookmarksRef = collection(
        db,
        "bookmarks",
        user.uid,
        "userBookmarks",
      );

      // 실시간으로 북마크 변경사항을 감지하고 업데이트
      unsubscribe = onSnapshot(userBookmarksRef, async (snapshot) => {
        const postIds = snapshot.docs.map((bookmark) => {
          const { postId } = bookmark.data();
          return postId;
        });
        const filterPosts = posts.filter((post) => postIds.includes(post.id));
        setBookmarks(filterPosts);
        setTotal(filterPosts.length);
      });
    };

    if (user && posts.length > 0) {
      fetchBookmarks();
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [user, posts]);

  return (
    <MyRoute>
      <Top>
        <Title>{user.displayName}님의 북마크</Title>
        <Text>총 {total}개의 게시물이 저장되어 있어요 🙌</Text>
      </Top>
      <Contents>
        {bookmarks.map((bookmark) => (
          <Post key={bookmark.id} {...bookmark} />
        ))}
      </Contents>
    </MyRoute>
  );
};

export default Bookmark;
