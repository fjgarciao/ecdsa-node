import server from "./server";
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import * as utils from 'ethereum-cryptography/utils';

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = utils.toHex(getAddressFromPrivateKey(privateKey));
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  function getAddressFromPrivateKey(privateKey) {
    var publicKey = secp256k1.getPublicKey(privateKey, false);
    var publicKeySlice = publicKey.slice(1, publicKey.length);
    var keccak = keccak256(publicKeySlice);
    var address = keccak.slice(keccak.length - 20, keccak.length);
    return address;
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type your private key: " value={privateKey} onChange={onChange}></input>
      </label>

      <label>
        Wallet Address: {address}
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
