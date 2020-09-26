import axios from 'axios';
import store from './store';
import moment from 'moment';

// For test: asios.get('...').delay(1000)
Promise.prototype.delay = function(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(this);
    }, time);
  });
};

// const BACKEND_URL = `${'explorer.os.hmny.io'}:8888`;
// const BACKEND_URL = `${window.location.hostname}:8888`;
const BACKEND_URL = `${'explorer.harmony.one'}:8888`;
const INSIGHT_BACKEND_URL = "http://54.187.20.215:8081"

const HTTP_BACKEND_URL = `https://${BACKEND_URL}`;
const SECRET = localStorage.getItem('secret');

// To be defined in listenWebsocket()
let ws = null;

function sendPost(url, params, config) {
  return axios.post(HTTP_BACKEND_URL + url, params, config);
}

function authGet(url, _params) {
  let params = Object.assign(
    {
      headers: { Authorization: 'Bearer ' + SECRET },
    },
    _params
  );
  return sendGet(url, params);
}

function sendGet(url, params) {
  return axios.get(HTTP_BACKEND_URL + url, params); // .delay(500)
}

function listenBackendWebsocket() {
  ws = new WebSocket(`wss://${BACKEND_URL}`, [SECRET]);

  ws.addEventListener('open', () => {
    ws.send('front-end: Hi.');
  });

  ws.addEventListener('message', res => {
    let data = JSON.parse(res.data);

    if (data.shards) {
      data.shards = Object.values(data.shards).map(shard => ({
        stakingTxCount: 0,
        stakingTxs: [],
        ...shard,
      }));
    }

    if (data.error) {
      alert(`Websocket Error: ${data.error}`);
      return;
    }
    if (data.cmd === 'reset') {
      store.reset();
    } else if (data.cmd === 'update') {
      store.update(data);
    } else if (data.cmd === 'init') {
      store.update(data);
    }
  });

  ws.addEventListener('error', error => {
    console.log('Websocket error', error);
  });

  ws.addEventListener('close', () => {
    console.log('Websocket closed');
  });
}

listenBackendWebsocket();

(function reconnectBackendWebsocket() {
  setInterval(() => {
    if (ws === null || ws.readyState === WebSocket.CLOSED) {
      // connect
      console.log('Connecting websocket...');
      listenBackendWebsocket();
      console.log('Connected!');
    }
  }, 5000);
})();

(function logUserVisit() {
  axios.get(INSIGHT_BACKEND_URL + "/user_visits");
})();

export default {
  reset(secret) {
    return sendPost('/reset', { secret });
  },
  getBlocks(pageIndex, pageSize) {
    return authGet('/blocks', { params: { pageIndex, pageSize } }).then(res => {
      let blocks = res.data.blocks;

      return blocks;
    });
  },
  getBlock(id) {
    return authGet('/block', { params: { id } }).then(res => {
      let block = res.data.block;

      return block;
    });
  },
  getBlockHashByNumber(height) {
    return axios.get(INSIGHT_BACKEND_URL +
      "/block_hash_by_number?block_height=" +
      height);
  },
  getTransactions(cursor, size) {
    return authGet('/txs-new', { params: { cursor, size } }).then(res => {
      let txs = res.data.txs;

      return txs;
    });
  },
  getStakingTransactions(cursor, size) {
    return authGet('/staking-txs-new', { params: { cursor, size } }).then(
      res => {
        let txs = res.data.txs;

        return txs;
      }
    );
  },
  getTransaction(id) {
    return authGet('/tx', { params: { id } }).then(res => {
      let tx = res.data.tx;

      if (tx.status !== 'UNKNOWN') {
        return tx;
      }

      // Check if pending
      for (var shard in store.data.pendingTxs) {
        if (store.data.pendingTxs.hasOwnProperty(shard)) {
          for (let t in store.data.pendingTxs[shard]) {
            if (store.data.pendingTxs[shard][t].hash === id) {
              return store.data.pendingTxs[shard][t];
            }
          }
        }
      }
      return null;
    });
  },
  getStakingTransaction(id) {
    return authGet('/staking-tx', { params: { id } }).then(res => {
      let tx = res.data.tx;

      return tx;
    });
  },
  getTransactionVolume(start_height) {
    return axios.get(INSIGHT_BACKEND_URL +
      "/block_transaction_count?min_block_height=" +
      start_height);
  },
  getGasUsed(start_height) {
    return axios.get(INSIGHT_BACKEND_URL +
      "/block_gas_used?min_block_height=" +
      start_height);
  },

  getValidatorByAddress(address) {
    return axios.get(INSIGHT_BACKEND_URL +
      "/validator_by_address?address=" +
      address);
  },
  getMaxBlockHeightTransactionVolume() {
    return axios.get(INSIGHT_BACKEND_URL +
      "/max_block_height_block_transaction_count")
  },
  getMaxBlockHeightGasUsed() {
    return axios.get(INSIGHT_BACKEND_URL +
      "/max_block_height_block_gas_used")
  },
  getCoinStats() {
    return authGet('/coin-stats').then(res => {
      const coinStats = res.data.coinStats;

      return coinStats;
    });
  },
  getAddress(params) {
    return authGet('/address', { params }).then(res => {
      let address = res.data.address;
      return address;
    });
  },
  getTxHistory(address, shardID, pageIndex) {
    return authGet('/tx-history', {
      params: { id: address, shardID, txView: 'ALL', pageIndex, pageSize: 25 },
    }).then(res => {
      let address = res.data.address;
      return address;
    });
  },
  getAddressShard(params) {
    return authGet('/address-shard', { params }).then(res => {
      let address = res.data.address;
      return address;
    });
  },
  getAddressShardTxHistory(address, shardID, pageIndex, pageSize) {
    return authGet('/address-shard-txs', {
      params: { address, shardID, pageIndex, pageSize },
    }).then(res => {
      let txs = res.txs;
      return txs;
    });
  },
  getAddressShardStakingTxHistory(address, shardID, pageIndex, pageSize) {
    return authGet('/address-shard-staking-txs', {
      params: { address, shardID, pageIndex, pageSize },
    }).then(res => {
      let txs = res.txs;
      return txs;
    });
  },
  search(input) {
    return authGet('/search', { params: { input } }).then(res => {
      let result = res.data.result;
      return result;
    });
  },
  getCxReceipt(id) {
    return authGet('/cx-receipt', { params: { id } }).then(res => {
      return res.data.receipt;
    });
  },
};
