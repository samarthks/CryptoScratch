const { intFromLE } = require("elliptic/lib/elliptic/utils");
const { verifySignature } = require("../utils");
const Transaction = require("./transaction");
const Wallet = require("./wallet");

describe("Transaction", () => {
  let transaction, senderWallet, recipient, amount;
  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = "receipent-public-key";
    amount = 50;
    transaction = new Transaction({ senderWallet, recipient, amount });
  });

  it("has a `id`", () => {
    expect(transaction).toHaveProperty("id");
  });

  describe("outputMap", () => {
    it("has an `outputMap`", () => {
      expect(transaction).toHaveProperty("outputMap");
    });
    it("output the amount to receipent", () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });
    it("output the remaining balance fro the `senderWaallet`", () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount
      );
    });
  });

  describe("input", () => {
    it("has an `input`", () => {
      expect(transaction).toHaveProperty("input");
    });
    it("has an `timestamp`in input", () => {
      expect(transaction.input).toHaveProperty("timestamp");
    });
    it("sets the `amount`to `senderwallet` balance", () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });
    it("sets the `address`to `senderwallet` publicKey", () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });
    it("signs the input", () => {
      expect(
        verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        })
      ).toBe(true);
    });
  });

  describe("validTransaction()", () => {
    let errorMock;
    beforeEach(() => {
      errorMock = jest.fn();
      global.console.error = errorMock;
    });
    describe("when the traansaction is valid", () => {
      it("returns true", () => {
        expect(Transaction.validTransaction(transaction)).toBe(true);
      });
    });
    describe("when the transaction is invalid", () => {
      describe("transaction outMap value is invalid", () => {
        it("returns false and logs an error", () => {
          transaction.outputMap[senderWallet.publicKey] = 999999;
          expect(Transaction.validTransaction(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe("traansaction input signature  is invalid", () => {
        it("returns false and logs an error", () => {
          transaction.input.signature = new Wallet().sign("data");
          expect(Transaction.validTransaction(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
  });
});
