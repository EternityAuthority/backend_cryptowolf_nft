const { MongoClient } = require('mongodb');
const env = require('../config');
const { filterwolfNFT } = require('./function_wolf');

async function insertwolfPackNFT(id, tokenId, wolfPackLink, totalSlotsAvailable_, totalSlotsInWolfPack, pointsOfWolfPack, wolfPackLife, wolfPackEnergy, wolfPackInPromo, askingPrice) {
    let result;
    const client = new MongoClient(env.database.url, { useNewUrlParser: true, useUnifiedTopology: true });

    let db = 'wolfPackNFT';
    let col = 'itemsNFTs';

    await client.connect();
    const real_db = client.db(db);
    const real_col = real_db.collection(col);

    let nft_data = {
        id: id,
        tokenId: tokenId,
        wolfPackLink: wolfPackLink,
        totalSlotsAvailable_: totalSlotsAvailable_,
        totalSlotsInWolfPack: totalSlotsInWolfPack,
        pointsOfWolfPack: pointsOfWolfPack,
        wolfPackLife: wolfPackLife,
        wolfPackEnergy: wolfPackEnergy,
        wolfPackInPromo: wolfPackInPromo,
        askingPrice: askingPrice
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

async function removewolfPackNFT(id) {
    let result;
    const client = new MongoClient(env.database.url, { useNewUrlParser: true, useUnifiedTopology: true });

    let db = 'wolfPackNFT';
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

async function filterwolfPackNFT(id, tokenId, wolfPackLink, totalSlotsAvailable_, totalSlotsInWolfPack, pointsOfWolfPack, wolfPackLife, wolfPackEnergy, wolfPackInPromo, askingPrice) {
    console.log('run filter function')
    let result;
    const client = new MongoClient(env.database.url, { useNewUrlParser: true, useUnifiedTopology: true });

    let db = 'wolfPackNFT';
    let col = 'itemsNFTs';

    await client.connect();
    const real_db = client.db(db);
    const real_col = real_db.collection(col);

    let nft_data = {
        id,
        tokenId,
        wolfPackLink,
        totalSlotsAvailable_,
        totalSlotsInWolfPack,
        pointsOfWolfPack,
        wolfPackLife,
        wolfPackEnergy,
        wolfPackInPromo,
        askingPrice
    };

    console.log(id, tokenId, wolfPackLink, totalSlotsAvailable_, totalSlotsInWolfPack, pointsOfWolfPack, wolfPackLife, wolfPackEnergy, wolfPackInPromo, askingPrice);

    const cursor = await real_col.find(nft_data).toArray();

    return cursor;
}


exports.insertwolfPackNFT = insertwolfPackNFT;
exports.removewolfPackNFT = removewolfPackNFT;
exports.filterwolfPackNFT = filterwolfPackNFT;