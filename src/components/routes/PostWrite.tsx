import { addDoc, collection, updateDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useLocation, useNavigate } from "react-router";
import { IUser } from "../Board/Post";

const PostWrite = () => {
  const [isLoading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [initialFileUrl, setInitialFileUrl] = useState<string | null>(null);
  const [type, setType] = useState<IUser["userType"]>("personal");
  const navigate = useNavigate();
  const location = useLocation();
  const postId = location.state;
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      return;
    }
    if (postId) {
      const fetchPost = async () => {
        setLoading(true);
        try {
          const docRef = doc(db, "posts", postId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const postData = docSnap.data();
            setPost(postData.post);
            setTitle(postData.title);
            setType(postData.type);
            if (postData.photo) {
              setInitialFileUrl(postData.photo);
            }
          }
        } catch (error) {
          console.error("Error fetching post: ", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    } else {
      const getType = async () => {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        const { userType } = docSnap.data() as IUser;
        setType(userType);
      };
      getType();
    }
  }, [postId]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id } = e.target;
    if (id === "title") {
      setTitle(e.target.value);
    } else if (id === "text") {
      setPost(e.target.value);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const maxSize = 2 * 1024 * 1024;
    if (files && files.length === 1) {
      const uploadFile = files[0];
      if (uploadFile && uploadFile.size > maxSize) {
        alert("파일은 2MB 이하로 올려주세요!");
        return;
      }
      setFile(uploadFile);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || isLoading || post === "") return;

    try {
      setLoading(true);
      let docRef;

      if (postId) {
        docRef = doc(db, "posts", postId);
        await updateDoc(docRef, {
          title,
          post,
          updateAt: Date.now(),
        });
      } else {
        docRef = await addDoc(collection(db, "posts"), {
          title,
          post,
          createAt: Date.now(),
          username: user.displayName || "Anonymous",
          userId: user.uid,
          type: type,
        });
      }

      if (file) {
        const fileRef = ref(storage, `posts/${user.uid}/${docRef.id}`);
        const result = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(docRef, {
          photo: url,
        });
      }

      setPost("");
      setFile(null);
      setInitialFileUrl(null);
      const ok = confirm("게시물을 업로드 하시겠어요?");
      if (ok) navigate("/board", { replace: true });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper className="container">
      <Form onSubmit={onSubmit}>
        <TitleArea
          required
          rows={1}
          onChange={onChange}
          value={title}
          placeholder="제목을 입력해주세요."
          id="title"
        />
        <TextArea
          required
          onChange={onChange}
          value={post}
          placeholder=""
          disabled={isLoading}
          id="text"
        />
        <AttachFileButton htmlFor="file">
          {file
            ? "Photo Added ✅"
            : initialFileUrl
              ? "Photo Attached ✅"
              : "Add photo"}
        </AttachFileButton>
        <AttachFileInput
          onChange={onFileChange}
          type="file"
          id="file"
          accept="image/*"
          disabled={isLoading}
        />
        <SubmitBtn
          type="submit"
          value={isLoading ? "Posting..." : postId ? "Update Post" : "Post"}
          disabled={isLoading}
        />
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
`;

const Form = styled.form`
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;

  #title,
  #text {
    width: 100%;
    padding: 20px;
    border: 2px solid #efefef;
    border-radius: 20px;
    font-size: 1rem;
    resize: none;
    &::placeholder {
      font-size: 1rem;
    }
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
`;

const TitleArea = styled.textarea``;

const TextArea = styled.textarea`
  height: 50vh;
  line-height: 1.5;
`;

const AttachFileButton = styled.label`
  padding: 10px 0;
  border-radius: 20px;
  border: 1px solid var(--primary-color);
  font-size: 14px;
  color: var(--primary-color);
  text-align: center;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  padding: 10px 0;
  border-radius: 20px;
  border: none;
  background-color: var(--primary-color);
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default PostWrite;
