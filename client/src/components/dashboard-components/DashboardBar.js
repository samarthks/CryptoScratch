import React from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

const Logos = styled.div`
  font-size: 1.5 em;
`;

const Bar = styled.div`
  display: grid;
  margin-bottom: 40px;
  grid-template-columns: 100px auto 100px 100px 100px;
`;

const ControlButtonElem = styled.div`
  cursor: pointer;
  ${(props) =>
    props.active &&
    css`
      text-shadow: 60px 60px  60px #03ff03;
    `}
`;

function toProperCase(lower){
return lower.charAt(0).toUpperCase()+lower.substr(1);
}
function ControlButton({ name, active }) {
  return <ControlButtonElem active={active}>{toProperCase(name)}</ControlButtonElem>;
}

export default function () {
  return (
    <Bar>
      <Logos> MyCrypto </Logos>
      <ControlButton active name="dashboard" />
      <ControlButton name="Settings" />
      <div>
        <Link to="/">Back to Home</Link>
      </div>
    </Bar>
  );
}
