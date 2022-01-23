const { MongoClient } = require('mongodb');
const { filter_attack, filter_defense, filter_gender, filter_breed } = require('../functions/utils');

const env = require('../config');

async function insertwolfNFT(attack, defense, gender, level, breed, tokenId, askingPrice, id) {
  console.log('run wolf add function');
  let result;
  const client = new MongoClient(env.database.url, { useNewUrlParser: true, useUnifiedTopology: true });

  let db = 'woflNFT';
  let col = 'itemsNFTs';

  await client.connect();
  const real_db = client.db(db);
  const real_col = real_db.collection(col);

  let nft_data = {
    attack: attack,
    defense: defense,
    gender: gender,
    level: level,
    breed: breed,
    tokenId: tokenId,
    askingPrice: askingPrice,
    id: id
  };


  console.log(attack, defense, gender, level, breed, tokenId, askingPrice, id);

  const cursor = real_col.insertOne(nft_data, function (err, result) {
    if (err) {
      result = false;
      throw err;
    } else {
      result = true;
    }
    client.close();

    return result;
  });
}

async function removewolfNFT(id) {
  let result;
  const client = new MongoClient(env.database.url, { useNewUrlParser: true, useUnifiedTopology: true });

  let db = 'woflNFT';
  let col = 'itemsNFTs';

  await client.connect();
  const real_db = client.db(db);
  const real_col = real_db.collection(col);

  let nft_data = {
    id: id
  };
  console.log(id);

  const cursor = real_col.deleteOne(nft_data, function (err, result) {
    if (err) {
      result = false;
      throw err;
    } else {
      result = true;
    }
    client.close();

    return result;
  });
}

async function filterwolfNFT(attack, defense, gender, breed) {
  console.log('run filter function')
  let result;
  const client = new MongoClient(env.database.url, { useNewUrlParser: true, useUnifiedTopology: true });

  let db = 'woflNFT';
  let col = 'itemsNFTs';

  await client.connect();
  const real_db = client.db(db);
  const real_col = real_db.collection(col);

  let filters = [];
  
  console.log(attack, defense, gender, breed);

  filters.push(filter_attack(attack));
  filters.push(filter_defense(defense));
  if(gender.length > 0)
  filters.push(filter_gender(gender));
  if(breed.length > 0)
  filters.push(filter_breed(breed));
  
  let filter = {
    $and: filters
  }

  console.log('filter', filter);

  const cursor = await real_col.find(filter).toArray();

  return cursor;
}

exports.insertwolfNFT = insertwolfNFT;
exports.removewolfNFT = removewolfNFT;
exports.filterwolfNFT = filterwolfNFT;