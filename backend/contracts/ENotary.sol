// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ENotary {

    struct Document {
        string cid;
        uint256 timestamp;
        address owner;
    }

    mapping(string => Document) public documents;
    mapping(address => string[]) public userDocuments;

    function notarizeDocument(string memory _hash, string memory _cid) public {
        require(documents[_hash].timestamp == 0, "Already notarized");

        documents[_hash] = Document({
            cid: _cid,
            timestamp: block.timestamp,
            owner: msg.sender
        });

        userDocuments[msg.sender].push(_hash);
    }

    function verifyDocument(string memory _hash)
        public
        view
        returns (string memory cid, uint256 timestamp, address owner)
    {
        Document memory doc = documents[_hash];
        return (doc.cid, doc.timestamp, doc.owner);
    }

    function getUserDocuments(address _user)
        public
        view
        returns (string[] memory)
    {
        return userDocuments[_user];
    }
}