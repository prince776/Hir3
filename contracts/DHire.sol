// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Strings {
  function concat(string memory _base, string memory _value) internal returns (string memory) {
    bytes memory _baseBytes = bytes(_base);
    bytes memory _valueBytes = bytes(_value);

    string memory _tmpValue = new string(_baseBytes.length + _valueBytes.length);
    bytes memory _newValue = bytes(_tmpValue);

    uint i;
    uint j;

    for(i=0; i<_baseBytes.length; i++) {
      _newValue[j++] = _baseBytes[i];
    }

    for(i=0; i<_valueBytes.length; i++) {
      _newValue[j++] = _valueBytes[i];
    }

    return string(_newValue);
  }
}

contract DHire {
  using Strings for string;

  string public name = "DHire";

  // Model
  struct User {
    string name;
    string bio;
    uint resumeId;
  }

  struct Resume {
    uint id;
    string hash; // to ipfs document
    string authorName;
    string authorBio;
  }

  mapping(address => User) private users;
  mapping(string => address) public nameToUser;

  uint public resumeCount = 0;
  mapping(uint => Resume) public resumes;

  // message: `author:timestamp:message`
  mapping(address => string[]) private messages;

  constructor() {
  }
  
  function registerUser(string memory _username, string memory _bio) public {
    require(bytes(_username).length > 0);
    require(msg.sender != address(0));

    require(nameToUser[_username] == address(0));

    users[msg.sender] = User(_username, _bio, 0);
    nameToUser[_username] = msg.sender;
  }

  function getSelf() public view returns(string memory, string memory, uint) {
    require(msg.sender != address(0));
    require(bytes(users[msg.sender].name).length > 0);

    return (users[msg.sender].name, users[msg.sender].bio, users[msg.sender].resumeId);
  }

  function getUser(string memory _username) public view returns(string memory, string memory, uint) {
    require(bytes(_username).length > 0);
    require(msg.sender != address(0));
    require(nameToUser[_username] != address(0));

    User memory user = users[nameToUser[_username]];
    return (user.name, user.bio, user.resumeId);
  }

  function uploadResume(string memory _docHash) public {
    require(bytes(_docHash).length > 0);
    require(msg.sender != address(0));

    require(bytes(users[msg.sender].name).length > 0);

    if (users[msg.sender].resumeId <= 0) { // no resume yet, create new
      resumeCount++;
      users[msg.sender].resumeId = resumeCount;
    }

    resumes[users[msg.sender].resumeId] = Resume(users[msg.sender].resumeId, _docHash, users[msg.sender].name, users[msg.sender].bio);
  }

  function updateBio(string memory _bio) public {
    require(bytes(_bio).length > 0);
    require(msg.sender != address(0));

    require(bytes(users[msg.sender].name).length > 0);

    users[msg.sender].bio = _bio;
    if (users[msg.sender].resumeId > 0) { // update bio in resume as well
      resumes[users[msg.sender].resumeId].authorBio = _bio;
    }
  }

  function getMessages() public view returns(string[] memory) {
    require(msg.sender != address(0));
    require(bytes(users[msg.sender].name).length > 0);
    return messages[msg.sender];
  }

  function sendMessage(string memory _rcvName, string memory _message) public {
    require(bytes(_rcvName).length > 0);
    require(bytes(_message).length > 0);

    require(msg.sender != address(0));
    require(bytes(users[msg.sender].name).length > 0);

    address rcvAddress = nameToUser[_rcvName];
    require(rcvAddress != address(0));

    string memory senderName = users[msg.sender].name;

    string memory delimeter = ":";
    string memory timestamp = toString(block.timestamp);
    string memory message = senderName.concat(delimeter);
    message = message.concat(_rcvName);
    message = message.concat(delimeter);
    message = message.concat(timestamp);
    message = message.concat(delimeter);
    message = message.concat(_message);
    
    // string memory message = string(concat(bytes(senderName), ":", bytes(_timestamp), ":", bytes(_message)));
    messages[rcvAddress].push(message);
    if (rcvAddress != msg.sender) {
        messages[msg.sender].push(message);
    }
  }

  // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Strings.sol#L15-L35
  function toString(uint value) internal pure returns (string memory) {
    if (value == 0) {
        return "0";
    }
    uint temp = value;
    uint digits;
    while (temp != 0) {
        digits++;
        temp /= 10;
    }
    bytes memory buffer = new bytes(digits);
    while (value != 0) {
        digits -= 1;
        buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
        value /= 10;
    }
    return string(buffer);
  }
}
