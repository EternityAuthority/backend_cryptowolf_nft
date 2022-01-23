var express = require('express');
var app = express();
const { insertmaterialNFT, removematerialNFT, filtermaterialNFT } = require('../functions/function_material');

app.post('/add', async function (req, res) {
  console.log('add wolf nft data');

  let level, tokenId, askingPrice, id;

  level = req.body.level;
  tokenId = req.body.tokenId;
  askingPrice = req.body.askingPrice;
  id = req.body.id;


  let result = await insertmaterialNFT(level, tokenId, askingPrice, id);

  if (result === true) {
    res.header(200).json({ status: "success" });
  } else {
    res.header(400).json({ status: "fail" });
  }
});

app.post('/remove', async function (req, res) {
  console.log('remove wolf nft data');

  let id;

  id = req.body.id;

  let result = await removematerialNFT(id);

  if (result === true) {
    res.header(200).json({ status: "success" });
  } else {
    res.header(400).json({ status: "fail" });
  }
});

// ADD NEW USER POST ACTION
app.post('/filter', async function (req, res) {
  console.log('material filter request');
  let level, tokenId, askingPrice, id;

  level = req.body.level;
  tokenId = req.body.tokenId;
  askingPrice = req.body.askingPrice;
  id = req.body.id;

  let result = await filtermaterialNFT(level, tokenId, askingPrice, id);

  console.log(result);
  if (result === false) {
    console.log('false')
    res.header(400).json({ status: "fail" });
  } else {
    console.log('true')
    res.header(200).json({ status: JSON.stringify(result) });
  }
})

module.exports = app;