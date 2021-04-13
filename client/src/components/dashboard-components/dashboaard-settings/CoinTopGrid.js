import React from "react";
import { DashboardContext } from "../DashboardProvider";
import styled from "styled-components";
import { DeletableTile } from "../dashboard-shared/Tile";

export const CoinTopGridStyled = styled.div`
display:grid
grid-template-columns: 1fr 1fr`;

export const CoinSymbol = styled.div`
  justify-self: right;
`;

const DeleteIcon = styled.div`
  justify-self: right;
  display: none;
  ${DeletableTile}:hover & {
    display: block;
    color: red;
  }
`;

export default function ({ name, symbol, topSection }) {
  return (
    <CoinTopGridStyled>
      <div>{name}</div>
      {topSection ? (
        <DeleteIcon>X</DeleteIcon>
      ) : (
        <CoinSymbol>{symbol}</CoinSymbol>
      )}
    </CoinTopGridStyled>
  );
}
