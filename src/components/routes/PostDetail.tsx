import { useParams } from "next/navigation";
import styled from "styled-components";

const PostDetail = () => {
  const param = useParams();

  return (
    <Wrapper className="container">
      <Detail>
        <Row>
          {/* <UserInfo>
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
                {avatar ? <Img src={avatar} /> : <MdOutlinePets />}
              </Avatar>
              <Username>{username}</Username>
            </User>
          </UserInfo>
          <Title>{title}</Title>*/}
        </Row>
        {/* {currentUserId === userId ? (
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
      )} */}
        {/* <Payload id="post">
            {post}
          </Payload>  */}
        {/* {photo ? (
        <Column className="photo">
          <Photo src={photo} />
        </Column>
      ) : null} */}
      </Detail>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Detail = styled.form`
  width: 80%;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  border: 2px solid #efefef;
`;

const Row = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

export default PostDetail;
