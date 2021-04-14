import "@babel/polyfill";

import React, { Component } from "react";
import _ from "lodash";

export const DashboardContext = React.createContext();

const cc = require("cryptocompare");
const MAX_FAVOURITES=10;
export default class DashboardProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "dashboard",
      favourites: ["BTC", "ETH", "NEO", "DOGE", "EOS"],
      ...this.savedSettings(),
      setPage: this.setPage,
      addCoin:this.addCoin,
      removeCoin:this.removeCoin,
      isFavourite:this.isFavourite,
      confirmFavourites: this.confirmFavourites,
    };
  }

  addCoin=key=>{
    let favourites=[...this.state.favourites];
    if(favourites.length<MAX_FAVOURITES){
      favourites.push(key);
      this.setState({favourites});
    }
  }

  removeCoin=key=>{
    let favourites=[...this.state.favourites];
  
      this.setState({favourites:_.pull(favourites,key)});
    
  }
  isFavourite=key=>_.includes(this.state.favourites,key);

  componentDidMount = () => {
    this.fetchCoins();

  };

  fetchCoins = async () => {
    let coinList = (await cc.coinList()).Data;
    this.setState({ coinList });
    console.log(coinList);
  };



  confirmFavourites = () => {
    this.setState({
      firstVisit: false,
      page: "dashboard",
    });
    localStorage.setItem(
      "cryptodash",
      JSON.stringify({
        favourites: this.state.favourites,
      })
    );
  };

  savedSettings() {
    let data = JSON.parse(localStorage.getItem("cryptodash"));
    if (!data) {
      return { page: "settings", firstVisit: true };
    }
    let{favourites}=data;
    return {favourites};
  }
  setPage = (page) => this.setState({ page });

  render() {
    return (
      <DashboardContext.Provider value={this.state}>
        {this.props.children}
      </DashboardContext.Provider>
    );
  }
}
