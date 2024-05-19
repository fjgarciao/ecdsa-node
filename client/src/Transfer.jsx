import { useState } from "react";
import server from "./server";
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes, toHex } from 'ethereum-cryptography/utils'

function Transfer({ setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
  }

  async function transfer(evt) {
    evt.preventDefault();
    var transaction = {
      amount: parseInt(sendAmount),
      recipient
    }
    var signature = secp256k1.sign(hashMessage(JSON.stringify(transaction)), privateKey);
    var message = {
      transaction: transaction,
      signature: {
        r: signature.r.toString(),
        s: signature.s.toString(),
        recovery: signature.recovery
      }
    };

    console.log(`Sending signed transaction message: ${JSON.stringify(message)}`);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, message);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
