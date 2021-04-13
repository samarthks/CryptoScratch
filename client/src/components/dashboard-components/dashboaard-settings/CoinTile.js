import React from "react";
import { SelectableTile, DeletableTile } from "../dashboard-shared/Tile";
import { DashboardContext } from "../DashboardProvider";
import CoinTopGrid from "./CoinTopGrid";
import CoinSymbol from "../dashboard-shared/CoinSymbol";
export default function ({ coinKey, topSection }) {
  return (
    <DashboardContext.Consumer>
      {({ coinList }) => {
        let coin = coinList[coinKey];
        let TileClass = SelectableTile;
        if (topSection) {
          TileClass = DeletableTile;
        }
        return (
          <TileClass>
            <CoinTopGrid
              topSection={topSection}
              name={coin.CoinName}
              symbol={coin.Symbol}
            />
            <CoinSymbol coin={coin} />
          </TileClass>
        );
      }}
    </DashboardContext.Consumer>
  );
}
