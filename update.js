const fs = require("fs");

const path = __dirname + "/build/json";
const buildImageUri = (oldValue, id) => "ipfs://" + id + ".png";

const getTokenId = (filePath) => {
  return filePath.match(/([0-9]+)\.json/)[1];
};

fs.readdirSync(path).forEach((fileName) => {
  const filePath = path + "/" + fileName;
  const stat = fs.statSync(filePath);

  if (!stat.isFile()) {
    return;
  }

  if (fileName.endsWith(".json")) {
    const jsonContent = require(filePath);
    const tokenId = getTokenId(fileName);

    jsonContent.image = buildImageUri(jsonContent.image, tokenId);

    fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));
  }
});
