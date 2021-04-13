import React from "react";
import styled from "styled-components";
import { DashboardContext } from "../DashboardProvider";

const ConfirmButtonStyled = styled.div`
  margin: 20px;
  color: green;
  cursor:pointer;
`;

export const CenterDiv = styled.div`
  display: grid;
  justify-content: center;
`;
export default function () {
  return (
      
    <DashboardContext.Consumer>
      {({ confirmFavourites }) => (
        <CenterDiv>
          <ConfirmButtonStyled onClick={confirmFavourites}>
            Confirm Favourites
          </ConfirmButtonStyled>
        </CenterDiv>
      )}
    </DashboardContext.Consumer>
  );
}
