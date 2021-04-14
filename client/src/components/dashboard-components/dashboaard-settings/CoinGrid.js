import React from 'react';
import {DashboardContext} from "../DashboardProvider";
import styled from 'styled-components';
import CoinTile from "./CoinTile"

export const CoinGridSytled=styled.div`
display:grid;
grid-template-columns:repeat(5, 1fr);
grid-gap:15px;`;

function getCoinsToDisplay(coinList,topSection,favourites){
    return topSection? favourites:Object.keys(coinList).slice(0,topSection?10:100);
}

export default function({topSection}){
    return <DashboardContext.Consumer>
        {({coinList,favourites})=><CoinGridSytled>
            {getCoinsToDisplay(coinList,topSection,favourites).map(coinKey=>
            <CoinTile topSection={topSection} coinKey={coinKey} />
               
           )}
            </CoinGridSytled>}
    </DashboardContext.Consumer>
}