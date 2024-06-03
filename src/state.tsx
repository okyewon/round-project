// import { useQuery } from "@tanstack/react-query";
// import { atom, useRecoilState } from "recoil";
// import { auth, db } from "./firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { useEffect } from "react";

// const userAtom = atom({
//   key: "userState",
//   default: null,
// });

// const useFetchUser = () => {
//   return useQuery("fetchUser", async () => {
//     const user = auth.currentUser;
//     return user;
//   });
// };

// const useFetchPosts = () => {
//   return useQuery("fetchPosts", async () => {
//     const postsCollection = collection(db, "posts");
//     const postsSnapshot = await getDocs(postsCollection);
//     const posts = postsSnapshot.docs.map((doc) => doc.data());
//     return posts;
//   });
// };

// const UserComponent = () => {
//   const { data: user } = useFetchUser();
//   const [userState, setUserState] = useRecoilState(userAtom);

//   useEffect(() => {
//     if (user) {
//       setUserState(user);
//     }
//   }, [user, setUserState]);

//   if (!user) return <div>Loading...</div>;
//   return <div>{user.displayName}</div>;
// };

// const PostsComponent = () => {
//   const { data: posts, isLoading } = useFetchPosts();
//   const [postsState, setPostsState] = useRecoilState(postsAtom);

//   useEffect(() => {
//     if (posts) {
//       setPostsState(posts);
//     }
//   }, [posts, setPostsState]);

//   if (isLoading) return <div>Loading...</div>;
//   return (
//     <div>
//       {postsState.map((post) => (
//         <div key={post.id}>{post.title}</div>
//       ))}
//     </div>
//   );
// };
