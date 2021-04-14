import React from "react";
import { SelectableTile, DeletableTile,DisabledTile } from "../dashboard-shared/Tile";
import { DashboardContext } from "../DashboardProvider";
import CoinTopGrid from "./CoinTopGrid";
import CoinSymbol from "../dashboard-shared/CoinSymbol";

function clickCoinHandler(topSection, coinKey, addCoin, removeCoin) {
  return topSection
    ? () => {
        removeCoin(coinKey);
      }
    : () => {
        addCoin(coinKey);
      };
}
export default function ({ coinKey, topSection }) {
  return (
    <DashboardContext.Consumer>
      {({ coinList, addCoin, removeCoin, isFavourite }) => {
        let coin = coinList[coinKey];
        let TileClass = SelectableTile;
        if (topSection) {
          TileClass = DeletableTile;
        } else if (isFavourite(coinKey)) {
          TileClass = DisabledTile;
        }
        return (
          <TileClass
            onClick={clickCoinHandler(topSection, coinKey, addCoin, removeCoin)}
          >
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
