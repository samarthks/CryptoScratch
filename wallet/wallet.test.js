const Wallet = require("./wallet");
const { verifySignature } = require("../utils");
const Transaction = require("./transaction");
const Blockchain = require("../blockchain-components/blockchain");
const { STARTING_BALANCE } = require("../config");
describe("Wallet", () => {
  let wallet;
  beforeEach(() => {
    wallet = new Wallet();
  });
  it("has a `balance`", () => {
    expect(wallet).toHaveProperty("balance");
  });
  it("has a `publicKey`", () => {
    //console.log(wallet.publicKey);
    expect(wallet).toHaveProperty("publicKey");
  });

  describe("signing data", () => {
    const data = "foobar";
    it("verifies a signature", () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data),
        })
      ).toBe(true);
    });
    it("does not verifies a signature", () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: new Wallet().sign(data),
        })
      ).toBe(false);
    });
  });

  describe("createTransaction()", () => {
    describe(" amount exceeds the balance", () => {
      it("throws an error", () => {
        expect(() =>
          wallet.createTransaction({
            amount: 999999,
            recipient: "foo-recipient",
          })
        ).toThrow("Amount exceed balance");
      });
    });
    describe(" amount is valid", () => {
      let transaction, amount, recipient;
      beforeEach(() => {
        amount = 50;
        recipient = "foo-recipient";
        transaction = wallet.createTransaction({ amount, recipient });
      });

      it("creates an instance of `Transaction`", () => {
        expect(transaction instanceof Transaction).toBe(true);
      });
      it("matches the transaction input with the wallet", () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
      });
      it("output the amount of the recipient", () => {
        expect(transaction.outputMap[recipient]).toEqual(amount);
      });
    });
    describe("chain is passed", () => {
      it("calls `Wallet.calculateValance`", () => {
        const calculateBalanceMock = jest.fn();
        const originalCalculateBalance = Wallet.calculateBalance;

        Wallet.calculateBalance = calculateBalanceMock;

        wallet.createTransaction({
          recipient: "foo",
          amount: 10,
          chain: new Blockchain().chain,
        });
        expect(calculateBalanceMock).toHaveBeenCalled();
        Wallet.calculateBalance = originalCalculateBalance;
      });
    });
  });

  describe("calculateBalance()", () => {
    let blockchain;
    beforeEach(() => {
      blockchain = new Blockchain();
    });
    describe("no output for wallet", () => {
      it("returns the `STARTING_BALANCE`", () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(STARTING_BALANCE);
      });
    });
    describe("output for wallet", () => {
      let transactionOne, transactionTwo;
      beforeEach(() => {
        transactionOne = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 50,
        });
        transactionTwo = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 60,
        });
        blockchain.addBlock({ data: [transactionOne, transactionTwo] });
      });
      it("adds the sum of all outputs to wallet balance", () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(
          STARTING_BALANCE +
            transactionOne.outputMap[wallet.publicKey] +
            transactionTwo.outputMap[wallet.publicKey]
        );
      });
      describe("ealeet made transaction", () => {
        let recentTransaction;
        beforeEach(() => {
          recentTransaction = wallet.createTransaction({
            recipient: "foo-address",
            amount: 30,
          });
          blockchain.addBlock({ data: [recentTransaction] });
        });
        it("returns output amount of the recent transaction", () => {
          expect(
            Wallet.calculateBalance({
              chain: blockchain.chain,
              address: wallet.publicKey,
            })
          ).toEqual(recentTransaction.outputMap[wallet.publicKey]);
        });
        describe("there are output next to and after the recent tranaction", () => {
          let sameBlockTransaction, nextBlockTransaction;
          beforeEach(() => {
            recentTransaction = wallet.createTransaction({
              recipient: "later-foo-address",
              amount: 60,
            });
            sameBlockTransaction = Transaction.rewardTransaction({
              minerWallet: wallet,
            });
            blockchain.addBlock({
              data: [recentTransaction, sameBlockTransaction],
            });
            nextBlockTransaction = new Wallet().createTransaction({
              recipient: wallet.publicKey,
              amount: 75,
            });
            blockchain.addBlock({ data: [nextBlockTransaction] });
          });
          it("includes output amount in the returned balance", () => {
            expect(
              Wallet.calculateBalance({
                chain: blockchain.chain,
                address: wallet.publicKey,
              })
            ).toEqual(
              recentTransaction.outputMap[wallet.publicKey] +
                sameBlockTransaction.outputMap[wallet.publicKey] +
                nextBlockTransaction.outputMap[wallet.publicKey]
            );
          });
        });
      });
    });
  });
});
