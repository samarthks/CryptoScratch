const Block = require("./block");
const cryptoHash = require("../utils/crypto-hash");
const { REWARD_INPUT, MINING_REWARD } = require("../config");
const Wallet = require("../wallet/wallet");
const Transaction = require("../wallet/transaction");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });
    this.chain.push(newBlock);
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      //const currentBlock = chain[i];
      const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
      const actualHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;
      // const { timestamp, lastHash, hash, data } = currentBlock;
      if (lastHash !== actualHash) {
        return false;
      }
      if (Math.abs(lastDifficulty - difficulty) > 1) return false;

      const validatedHash = cryptoHash(
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty
      );
      if (hash !== validatedHash) {
        return false;
      }
    }
    return true;
  }

  replaceChain(chain, validateTransactions, onSuccess) {
    if (chain.length <= this.chain.length) {
      console.error("Incoming chain should be longer");
      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error("Incoming chain must be valid");
      return;
    }
    if (validateTransactions && !this.validTransactionData({ chain })) {
      console.error("incoming chain has invaalid data");
    }

    if (onSuccess) {
      onSuccess();
    }
    console.log("replacing chain with", chain);
    this.chain = chain;
  }

  validTransactionData({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();
      let rewardTransactionCount = 0;

      for (let transaction of block.data) {
        if (transaction.input.address === REWARD_INPUT.address) {
          rewardTransactionCount += 1;
          if (rewardTransactionCount > 1) {
            console.error("Miner exceeds limit");
            return false;
          }
          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error("Miner reward is invalid");
            return false;
          }
        } else {
          if (!Transaction.validTransaction(transaction)) {
            console.error("Invalid Transaction");
            return false;
          }
          const trueBalance = Wallet.calculateBalance({
            chain: this.chain,
            address: transaction.input.address,
          });
          if (transaction.input.amount !== trueBalance) {
            console.error("Invalid input aamount");
            return false;
          }
          if (transactionSet.has(transaction)) {
            console.error(
              "Identical transaction appears more than once in the block"
            );
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }
    return true;
  }
}
module.exports = Blockchain;
