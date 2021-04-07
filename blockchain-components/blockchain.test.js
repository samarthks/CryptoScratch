const Blockchain = require("./blockchain");
const Block = require("./block");
const cryptoHash = require("../utils/crypto-hash");
const Wallet = require("../wallet/wallet");
const Transaction = require("../wallet/transaction");

describe("Blockchain", () => {
  let blockchain, newChain, originalChain, errorMock;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    errorMock = jest.fn();
    originalChain = blockchain.chain;
    global.console.error = errorMock;
  });

  it("contains a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("adds a new block to the chain", () => {
    const newData = "foo bar";
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidChain()", () => {
    describe("when chain does not start with the genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake-genesis" };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("when the chain starts with the genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "Avengers" });
        blockchain.addBlock({ data: "Avengers2" });
        blockchain.addBlock({ data: "IronMan" });
      });

      describe("lastHash reference is changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lastHash";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("the chain contains a block with invalid field(timestamp or data field)", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "broken-data";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("the chain contains a block with a jumped difficulty", () => {
        it("returns false", () => {
          const lastBlock = blockchain[blockchain.chain.length] - 1;
          const lastHash = lastBlock.hash;
          const timestamp = Date.now();
          const nonce = 0;
          const data = [];
          const difficulty = lastBlock.difficulty - 3;
          const hash = cryptoHash(timestamp, lastHash, nonce, difficulty, data);
          const badBlcok = new Block({
            timestamp,
            lastHash,
            hash,
            nonce,
            difficulty,
            data,
          });
          blockchain.chain.push(badBlcok);
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("the chain does not contains any invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe("replaceChain()", () => {
    let logMock;

    beforeEach(() => {
      logMock = jest.fn();

      global.console.log = logMock;
    });

    describe("when new chain is not longer", () => {
      beforeEach(() => {
        newChain.chain[0] = { data: "newdata" };
        blockchain.replaceChain(newChain.chain);
      });

      it("does not replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain);
      });
      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("when new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Avengers" });
        newChain.addBlock({ data: "Avengers2" });
        newChain.addBlock({ data: "IronMan" });
      });

      describe("and the chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "fakehash";
          blockchain.replaceChain(newChain.chain);
        });
        it("does not replace the chain", () => {
          newChain.chain[2].hash = "fakehash";
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(originalChain);
        });
        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("and the chain is valid", () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });
        it("replaces the chain", () => {
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(newChain.chain);
        });
        it("logs about the replaced chain", () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
    describe("the `validateTransactions`flag is true", () => {
      it("calls validTransactionData()", () => {
        const validTransactionDataMock = jest.fn();
        newChain.addBlock({ data: "foo" });
        blockchain.validTransactionData = validTransactionDataMock;
        blockchain.replaceChain(newChain.chain, true);
        expect(validTransactionDataMock).toHaveBeenCalled();
      });
    });
  });

  describe("validTransactionData()", () => {
    let transaction, rewardTransaction, wallet;
    beforeEach(() => {
      wallet = new Wallet();
      transaction = wallet.createTransaction({
        recipient: "foo-address",
        amount: 65,
      });
      rewardTransaction = Transaction.rewardTransaction({
        minerWallet: wallet,
      });
    });
    describe("transaction data is valid", () => {
      it("returns true", () => {
        newChain.addBlock({ data: [transaction, rewardTransaction] });
        expect(blockchain.validTransactionData({ chain: newChain })).toBe(true);
        expect(errorMock).not.toHaveBeenCalled();
      });
    });

    describe("transaction data has multiple reward", () => {
      it("returns false and logs error", () => {
        newChain.addBlock({
          data: [transaction, rewardTransaction, rewardTransaction],
        });
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        );
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("transaction data has atleast one malformed outputMap", () => {
      describe("transaction is not a reward transaction", () => {
        it("returns false and logs error", () => {
          transaction.outputMap[wallet.publicKey] = 999999;
          newChain.addBlock({ data: [transaction, rewardTransaction] });
          expect(
            blockchain.validTransactionData({ chain: newChain.chain })
          ).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe("transaction is a reward transaction", () => {
        it("returns false and logs error", () => {
          rewardTransaction.outputMap[wallet.publicKey] = 999999;
          newChain.addBlock({ data: [transaction, rewardTransaction] });
          expect(
            blockchain.validTransactionData({ chain: newChain.chain })
          ).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });

    describe("transaction data has atleast one malformed input", () => {
      it("returns false", () => {
        wallet.balance = 9000;
        const evilOutputMap = {
          [wallet.publicKey]: 8900,
          fooRecipient: 100,
        };
        const evilTransaction = {
          input: {
            timestamp: Date.now(),
            amount: wallet.balance,
            address: wallet.publicKey,
            signature: wallet.sign(evilOutputMap),
          },
          outputMap: evilOutputMap,
        };
        newChain.addBlock({ data: [evilTransaction, rewardTransaction] });
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        );
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("block contains multiple identical transactions", () => {
      it("returns false", () => {
        newChain.addBlock({
          data: [transaction, transaction, transaction, rewardTransaction],
        });
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        );
        expect(errorMock).toHaveBeenCalled();
      });
    });
  });
});
