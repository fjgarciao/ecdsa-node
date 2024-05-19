import server from "./server";
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { toHex, hexToBytes} from 'ethereum-cryptography/utils';

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = toHex(secp256k1.getPublicKey(hexToBytes(privateKey)));
    console.log('Address (public key):', address);

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
