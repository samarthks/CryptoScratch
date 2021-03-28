const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

class Block {
  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
  static genesis() {
    return new this(GENESIS_DATA); //this() keyword represent Block instance
  }
  static mineBlock({ lastBlock, data }) {
    let hash, timestamp;
    const { difficulty } = lastBlock;
    let nonce = 0;
    //const timestamp = Date.now();

    /**
     * evert time it found new hash until the nonce value equal to difficulty value and timestamp gives exact time on every iteration of loop.
     * the condition check the substring of hash should should not contain starting zeros from 0 position to difficulty position.
     *
     */

    const lastHash = lastBlock.hash;
    do {
      nonce++;
      timestamp = Date.now();
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return new this({
      timestamp,
      lastHash,
      data,
      difficulty,
      nonce,
      hash,
    });
  }
}

module.exports = Block;
