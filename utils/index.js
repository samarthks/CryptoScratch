/*
Ellipic Curve (EC) based cryptography
is a key-based technique for encrypting data. 
ECC focuses on pairs of public and private keys for decryption and encryption of web traffic. 
ECC is frequently discussed in the context of the Rivest–Shamir–Adleman (RSA) cryptographic algorithm.
secp256k1 is a type to elliptic curve used for key pairing.
Standards for Efficient Cryptography Prime 256 bits koblets
*/

const EC = require("elliptic").ec;
const cryptoHash = require("./crypto-hash");

const ec = new EC("secp256k1");

const verifySignature = ({ publicKey, data, signature }) => {
  const keyFromPublic = ec.keyFromPublic(publicKey, "hex");
  return keyFromPublic.verify(cryptoHash(data), signature);
};

module.exports = { ec, verifySignature };
