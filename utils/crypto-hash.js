const crypto = require("crypto");
//const hexToBinary=require('hex-to-binary');
const cryptoHash = (...inputs) => {
  //... spread operator for multiple arguments
  const hash = crypto.createHash("sha256");
  hash.update(
    inputs
      .map((input) => JSON.stringify(input))
      .sort()
      .join(" ")
  ); //to have argument in 1 order
  return hash.digest("hex");
};
module.exports = cryptoHash;
