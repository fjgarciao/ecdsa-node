const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
var log4js = require("log4js");
var logger = log4js.getLogger();
logger.level = "debug";

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "02672c7beb593a778e21c08ae86088b5854395c1fdadf742f75d667db66799f313": 100,
  "02df49e7def1c94218712ec041c3001a089c21d401569061bcc740f7461d9dc81a": 50,
  "0263d7cf81cd31bd9f70f4dc2968b2e0a21b89bc0456023e2112f82ddf9fd0ede5": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  logger.debug(`Request body: ${JSON.stringify(req.body)}`);
  const { transaction, signature } = req.body;
  const { recipient, amount } = transaction;
  const { r, s, recovery } = signature;

  const sig = new secp256k1.Signature(BigInt(r), BigInt(s), recovery);
  const data = JSON.stringify(transaction);
  const hash = keccak256(utf8ToBytes(data));

  const sender = sig.recoverPublicKey(hash).toHex();
  logger.debug(`Sender (public key): ${sender}`);

  if (sender) {
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: "Invalid signature!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
