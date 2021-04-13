import React from 'react';
import {DashboardContext} from "../DashboardProvider";

export default function(props){
    return <DashboardContext.Consumer>
{({coinList})=>{
    if(!coinList){
        return <div>
            Loading Coins
        </div>
    }
    return <div>{props.children}</div>
}}
    </DashboardContext.Consumer>
}