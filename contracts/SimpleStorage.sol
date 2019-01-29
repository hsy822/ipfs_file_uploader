pragma solidity ^0.5.0;

contract SimpleStorage {

  mapping (address => string) ipfsHash;

  function set(string memory _hash) public {
    ipfsHash[msg.sender] = _hash;
  }

  function get(address _user) public view returns (string memory) {
    return ipfsHash[_user];
  }

}