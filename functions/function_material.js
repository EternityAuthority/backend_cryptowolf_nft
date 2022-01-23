const { MongoClient } = require('mongodb');
const env = require('../config');
const { filterwolfNFT } = require('./function_wolf');

async function insertmaterialNFT(level, tokenId, askingPrice, id) {
    let result;
    const client = new MongoClient(env.database.url, { useNewUrlParser: true, useUnifiedTopology: true });

    let db = 'materialNFT';
    let col = 'itemsNFTs';

    await client.connect();
    const real_db = client.db(db);
    const real_col = real_db.collection(col);

    let nft_data = {
        level: level,
        tokenId: tokenId,
        askingPrice: askingPrice,
        id: id,
    };

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


async function removematerialNFT(id) {
    let result;
    const client = new MongoClient(env.database.url, { useNewUrlParser: true, useUnifiedTopology: true });

    let db = 'materialNFT';
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

async function filtermaterialNFT(level, tokenId, askingPrice, id) {
    console.log('run filter function')
    let result;
    const client = new MongoClient(env.database.url, { useNewUrlParser: true, useUnifiedTopology: true });

    let db = 'wolfPackNFT';
    let col = 'itemsNFTs';

    await client.connect();
    const real_db = client.db(db);
    const real_col = real_db.collection(col);

    let nft_data = {
        level,
        tokenId,
        askingPrice,
        id
    };

    console.log(level, tokenId, askingPrice, id);

    const cursor = await real_col.find(nft_data).toArray();

    return cursor;
}

exports.insertmaterialNFT = insertmaterialNFT;
exports.removematerialNFT = removematerialNFT;
exports.filtermaterialNFT = filtermaterialNFT;
