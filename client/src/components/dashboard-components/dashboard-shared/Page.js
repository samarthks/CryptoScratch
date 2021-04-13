import React from 'react';
import {DashboardContext} from "../DashboardProvider";

export default function({name,children}){
    return <DashboardContext.Consumer>
        {({page})=>{
            if(page!==name){
                return null;
            }
            return <div>{children} </div>;
        }}
    </DashboardContext.Consumer>
}