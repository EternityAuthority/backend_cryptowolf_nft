const Web3 = require('web3');
const { MongoClient } = require('mongodb');
const Market_Contract = require('../contracts/Market.json');
const MaterialsNFTJSON = require('../contracts/MaterialsNFT.json');
const WolfsNFTJSON = require('../contracts/WolfsNFT.json');
const WolfPacksNFTJSON = require('../contracts/WolfPacksNFT.json');
const { MultiCall } = require('eth-multicall');
const env = require('../config');

var curblk_add = 0, curblk_rmv = 0, curblk_sld = 0;

const WOLF_C_ADDR = WolfsNFTJSON.address;
const WOLFPACK_C_ADDR = WolfPacksNFTJSON.address;
const MAT_C_ADDR = MaterialsNFTJSON.address;

async function scan_event() {
    console.log('Scan all events on blocks');
    const web3 = await new Web3(
        new Web3.providers.HttpProvider(env.rpcprovider)
    );
    var contract = new web3.eth.Contract(Market_Contract.abi, Market_Contract.address);

    let dels = [], adds = [];
    let filter = { fromBlock: curblk_rmv, toBlock: 'latest' }; // filter for your address
    let all_evs = await contract.getPastEvents('itemRemoved', filter, function (error, events) { });
    dels = await del_dblist(all_evs);
    console.log('itemRemoved-Events', dels);

    filter = { fromBlock: curblk_sld, toBlock: 'latest' }; // filter for your address
    all_evs = await contract.getPastEvents('itemSold', filter, function (error, events) { });
    dels.concat(await del_dblist(all_evs));
    console.log('itemSold-Events', dels);

    filter = { fromBlock: curblk_add, toBlock: 'latest' }; // filter for your address
    all_evs = await contract.getPastEvents('itemAdded', filter, function (error, events) { });
    adds = await add_dblist(all_evs, dels);
    console.log('itemAdded-Events', adds);
}

async function add_dblist(params, dels) {
    let res = []
    const client = new MongoClient(env.database.url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    for (let i = 0; i < params.length; i++) {
        let element = params[i];
        let ele_id = element.returnValues.id;

        if (!dels.includes(element.returnValues.id)) {
            let db;
            let col = 'itemsNFTs';
            if (element.returnValues.tokenAddress == WOLF_C_ADDR) {
                console.log('Event Contract Address ---> ',i, WOLF_C_ADDR);
                db = 'woflNFT';
                var real_db = client.db(db);
                var real_col = real_db.collection(col);
                var cursor = await real_col.find({ id: ele_id }).toArray();
                console.log('MongoDB ---> ', db, cursor);
                if (cursor.length == 0) {
                    res.push(ele_id);
                }
            } else if (element.returnValues.tokenAddress == WOLFPACK_C_ADDR) {
                console.log('Event Contract Address ---> ', i, WOLFPACK_C_ADDR);
                db = 'wolfPackNFT';
                var real_db = client.db(db);
                var real_col = real_db.collection(col);
                var cursor = await real_col.find({ id: ele_id }).toArray();
                console.log('MongoDB ---> ', db, cursor);
                if (cursor.length == 0) {
                    res.push(ele_id);
                }
            } else if (element.returnValues.tokenAddress == MAT_C_ADDR) {
                console.log('Event Contract Address ---> ', i, MAT_C_ADDR);
                db = 'materialNFT';
                var real_db = client.db(db);
                var real_col = real_db.collection(col);
                var cursor = await real_col.find({ id: ele_id }).toArray();
                console.log('MongoDB ---> ', db, cursor);
                if (cursor.length == 0) {
                    res.push(ele_id);
                }
            }
        }
    }
    client.close();
    return res;
}

async function del_dblist(params) {
    let del_list = [];
    const client = new MongoClient(env.database.url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    for (let i = 0; i < params.length; i++) {
        const element = params[i];
        let ele_id = element.returnValues.id;
        console.log('id', id);

        let db;
        let col = 'itemsNFTs';
        if (element.returnValues.tokenAddress == WOLF_C_ADDR) {
            db = 'woflNFT';
            var real_db = client.db(db);
            var real_col = real_db.collection(col);
            var cursor = await real_col.find({ id: ele_id }).toArray();
            if (cursor.length > 0) {
                del_list.push(ele_id);
            }
        } else if (element.returnValues.tokenAddress == WOLFPACK_C_ADDR) {
            db = 'wolfPackNFT';
            var real_db = client.db(db);
            var real_col = real_db.collection(col);
            var cursor = await real_col.find({ id: ele_id }).toArray();
            if (cursor.length > 0) {
                del_list.push(ele_id);
            }
        } else if (element.returnValues.tokenAddress == MAT_C_ADDR) {
            db = 'materialNFT';
            var real_db = client.db(db);
            var real_col = real_db.collection(col);
            var cursor = await real_col.find({ id: ele_id }).toArray();
            if (cursor.length > 0) {
                del_list.push(ele_id);
            }
        }
    }
    client.close();
    return del_list;
}

exports.scan_event = scan_event;