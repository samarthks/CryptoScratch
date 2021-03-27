const Blockchain = require("./blockchain");
const Block = require("./block");

describe("Blockchain", () => {
  let blockchain;
  beforeEachTest(() => {
    blockchain = new Blockchain();
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
      describe("lastHash reference is changed", () => {
        it("returns false", () => {
          blockchain.addBlock({ data: "Avengers" });
          blockchain.addBlock({ data: "Avengers2" });
          blockchain.addBlock({ data: "IronMan" });
          blockchain.chain[2].lastHash = "broken-lastHash";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      describe("the chain contains a block with invalid field(timestamp or data field)", () => {
        it("returns false", () => {
            blockchain.addBlock({ data: "Avengers" });
            blockchain.addBlock({ data: "Avengers2" });
            blockchain.addBlock({ data: "IronMan" });
            blockchain.chain[2].data = "broken-data";
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
          
        });
      });
      describe("the chain does not contains any invalid blocks", () => {
        it("returns true", () => {
            blockchain.addBlock({ data: "Avengers" });
            blockchain.addBlock({ data: "Avengers2" });
            blockchain.addBlock({ data: "IronMan" });
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
          
        });
      });
    });
  });
});
