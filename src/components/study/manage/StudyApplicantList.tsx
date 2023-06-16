import { HTMLAttributes } from "react";
import styled from "styled-components";
import { colors } from "../../../constants/colors";
import * as fonts from "../../../constants/fonts";
import React, { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import UserInfoModal from "../../modal/UserInfoModal";
import { useQuery } from "react-query";
import { getStudyAccept, putAcceptStudy } from "../../../api/api-study";

type StudyApplicantListProps = {
  studyId: string;
};

interface StudyAcceptData {
  _id: string;
  study_id: string;
  user_id: string;
  user_name: string;
  is_leader: boolean;
  goal: string;
  accept: number;
}

const StudyApplicantList = ({ studyId }: StudyApplicantListProps) => {
  const accept = 1;
  const unAccept = 2;
  // {/* 변경 */}
  const onAcceptButton = async (index: number) => {
    const userId = studyAcceptData[index].user_id;
    console.log(
      `putAcceptStudy의 헤더와 바디는,
      token:${String(localStorage.getItem("token"))},
      studyId:${studyId},
      userId:${userId},
      accept:${accept}`
    );
    await putAcceptStudy(
      String(localStorage.getItem("token")),
      studyId,
      userId,
      accept
    );
  };
  const onDeleteButton = async (index: number) => {
    const userId = studyAcceptData[index].user_id;
    await putAcceptStudy(
      String(localStorage.getItem("token")),
      studyId,
      userId,
      unAccept
    );
  };
  // const onAcceptButton = () => {};
  // const onDeleteButton = () => {};
  // getStudyAccept(studyId, accept).then((res) => {
  //   console.log("1234");
  // });
  // console.log(String(localStorage.getItem("token")));
  // console.log(studyId);

  // {/* 변경 */}
  const {
    data: studyAcceptData,
    isLoading,
    isError,
  } = useQuery(["studyAcceptData"], () =>
    getStudyAccept(studyId, 0).then((response) => response.data)
  );
  if (isLoading) {
    // 로딩 상태를 표시
    return <div>Loading...</div>;
  }

  if (isError) {
    // 에러 상태를 표시
    return <div>Error occurred while fetching data</div>;
  }

  console.log(`studyAcceptData:`, studyAcceptData);
  const members = studyAcceptData;
  const [userInfoModalOpen, setUserInfoModalOpen] = React.useState(false);

  const handleOpenUserInfoModal = () => {
    setUserInfoModalOpen(true);
  };

  const handleCloseUserInfoModal = () => {
    setUserInfoModalOpen(false);
  };
  return (
    <>
      {members.map((member: StudyAcceptData, index: number) => (
        <CardContainer key={index}>
          <CardContent>
            <StyledName onClick={handleOpenUserInfoModal}>
              {/* 변경 */}
              {member.user_name}
            </StyledName>
            <Modal open={userInfoModalOpen} onClose={handleCloseUserInfoModal}>
              <UserInfoModal
                // {/* 변경 */}
                userId={member.user_id}
                handleModalClose={handleCloseUserInfoModal}
              />
            </Modal>
            {/* 변경 */}
            <StyledDescription>{member.goal}</StyledDescription>
          </CardContent>
          <StyledCommonButton
            backgroundColor={colors.main_mint}
            onClick={() => onAcceptButton(index)}
          >
            신청 수락
          </StyledCommonButton>
          <StyledCommonButton
            backgroundColor={colors.main_red}
            onClick={() => onDeleteButton(index)}
          >
            회원 거절
          </StyledCommonButton>
        </CardContainer>
      ))}
    </>
  );
};
export default StudyApplicantList;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  color: ${colors.main_navy};
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  background-color: ${colors.back_navy}; /* 수정된 부분 */
  border-radius: 10px; /* 수정된 부분 */
`;

const StyledName = styled.p`
  font-weight: bold;
  margin-right: 10px;
  margin-left: 20px;
  cursor: pointer;
`;

const StyledDescription = styled.p`
  flex-grow: 1;
  margin-right: 10px;
  margin-left: 100px;
`;
interface StyledCommonButtonProps extends HTMLAttributes<HTMLDivElement> {
  backgroundColor?: string;
}
const StyledCommonButton = styled.div<StyledCommonButtonProps>`
  cursor: pointer;
  margin-left: 20px;
  width: 132px;
  height: 45px;
  background-color: ${(props) => props.backgroundColor};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 10px;
  &:hover {
    background-color: ${colors.main_navy};
    color: white;
  }
  ${fonts.SubText}
`;
