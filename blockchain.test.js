const Blockchain = require("./blockchain");
const Block = require("./block");

describe("Blockchain", () => {
  let blockchain, newChain, originalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    originalChain = blockchain.chain;
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

      describe("the chain does not contains any invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });

    describe("replaceChain()", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Avengers" });
        newChain.addBlock({ data: "Avengers2" });
        newChain.addBlock({ data: "IronMan" });
      });

      describe("when new chain is not longer", () => {
        it("does not replace the chain", () => {
          newChain.chain[0] = { new: "newdata" };
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(originalChain);
        });
      });

      describe("when new chain is longer", () => {
        describe("and the chain is invalid", () => {
          it("does not replace the chain", () => {
            newChain.chain[2].hash = "fakehash";
            blockchain.replaceChain(newChain.chain);
            expect(blockchain.chain).toEqual(originalChain);
          });
        });

        describe("and the chain is valid", () => {
          it("replaces the chain", () => {
            blockchain.replaceChain(newChain.chain);
            expect(blockchain.chain).toEqual(newChain.chain);
          });
        });
      });
    });
  });
});
