const PORT = 3000;
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const web3 = require("web3");

//app.use(cors);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let whitelistAddresses = [
  "0X5B38DA6A701C568545DCFCB03FCB875F56BEDDC4",
  "0X5A641E5FB72A2FD9137312E7694D42996D689D99",
  "0XDCAB482177A592E424D1C8318A464FC922E8DE40",
  "0X6E21D37E07A6F7E53C7ACE372CEC63D4AE4B6BD0",
  "0X09BAAB19FC77C19898140DADD30C4685C597620B",
  "0XCC4C29997177253376528C05D3DF91CF2D69061A",
  "0xdD870fA1b7C4700F2BD7f44238821C26f7392148", // The address in remix
  "0x4f1046Fd53c7ed67FA47F4b911a34DE383177a47", // SwoleApes Address
  "0x8cf33e159847ebC6832c818655771232777A6a5F", // acct 3
  "0xce17fc11903491FeD22457B6942e4A453995837B",
];

const leafNodes = whitelistAddresses.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

const buf2hex = (addr) => "0x" + addr.toString("hex");
console.log(buf2hex(merkleTree.getRoot()));
const root = buf2hex(merkleTree.getRoot());
console.log(root);

const rootHash = merkleTree.getRoot();
console.log("Whitelist Merkle Tree\n", merkleTree.toString());
console.log("Root Hash: ", rootHash);

var claimingAddress = leafNodes[8];
const hexProof = merkleTree.getHexProof(claimingAddress);
console.log(hexProof);
console.log(merkleTree.verify(hexProof, claimingAddress, rootHash));
const verify = merkleTree.verify(hexProof, claimingAddress, rootHash);

app.use(express.static(__dirname + ""));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/proof/:address", (req, res) => {
  let addrs = req.params.address;
  let hexProof = merkleTree.getHexProof(keccak256(addrs));
  let hashAddr = keccak256(addrs);
  if (hexProof.length > 0) {
    var v = true;
  } else {
    v = false;
  }
  // send json of res
  res.json({ hexProof, addrs, v, hashAddr });
});

app.get("/nft/:id", (req, res) => {
  let id = req.params.id;
  res.sendFile(path.join(__dirname, "/json/" + id + ".json"));

  //res.json({ hexProof, addrs, v, hashAddr });
});

app.get("/api/:id", (req, res) => {
  let id = req.params.id;
  res.sendFile(path.join(__dirname, "/json/" + id + ".json"));
});

app.listen(PORT, () => console.log("server running on PORT " + PORT));
