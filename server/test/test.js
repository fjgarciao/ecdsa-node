var assert = require('assert');
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");
const { getAddress } = require('../scripts/generate');

describe('getAddress', function() {
  it('should return the right address', function() {
    var publicKey = '04385c3a6ec0b9d57a4330dbd6284989be5bd00e41c535f9ca39b6ae7c521b81cd2443fef29e7f34aa8c8002eceaff422cd1f622bb4830714110e736044d8f084f';
    var expectedAddress = '16bb6031cbf3a12b899ab99d96b64b7bbd719705';
    assert.equal(toHex(getAddress(hexToBytes(publicKey))), expectedAddress);
  });
});
