const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

function getAddress(publicKey) {
    var publicKeySlice = publicKey.slice(1, publicKey.length);
    var keccak = keccak256(publicKeySlice);
    var address = keccak.slice(keccak.length - 20, keccak.length);
    return address;
}

module.exports = { getAddress };

const privateKey = secp256k1.utils.randomPrivateKey();

console.log('private key:', toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey, false);

console.log('public key:', toHex(publicKey));

const address = getAddress(publicKey);

console.log('address:', toHex(address));
