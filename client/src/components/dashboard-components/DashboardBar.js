import React from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { DashboardContext } from "./DashboardProvider";

const Logos = styled.div`
  font-size: 1.5 em;
`;

const Bar = styled.div`
  display: grid;
  margin-bottom: 40px;
  grid-template-columns: 180px auto 100px 100px 50px;
`;

const ControlButtonElem = styled.div`
  cursor: pointer;
  ${(props) =>
    props.active &&
    css`
      color: green;
    `}
`;

function toProperCase(lower) {
  return lower.charAt(0).toUpperCase() + lower.substr(1);
}
function ControlButton({ name}) {
  return (
    <DashboardContext>
      {({ page,setPage }) => (
        <ControlButtonElem active={page===name}
        onClick={()=>setPage(name)}>
          {toProperCase(name)}
        </ControlButtonElem>
      )}
    </DashboardContext>
  );
}

export default function () {
  return (
    <Bar>
      <Logos> MyCrypto </Logos>
      <ControlButton  name="dashboard" />
      <ControlButton  name="settings" />
      <div>
        <Link to="/">Back</Link>
      </div>
    </Bar>
  );
}
