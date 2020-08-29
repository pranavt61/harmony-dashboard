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

(function log() {
  return axios.get('http://54.212.182.221:8081');
})();

(function listenCoinPrice() {
  setInterval(() => {
    axios
      .get('https://api.coinstats.app/public/v1/coins/harmony?currency=usd')
      .then(res => {
        if (res.status == 200) {
          store.updateCoinPrice(res.data.coin.price);
          store.updateMarketCap(res.data.coin.marketCap);
        } else {
          // ERR
          console.err('COIN PRICE ERROR CODE: ' + res.status);
        }
      });
  }, 1000);
})();

(function listenTransactionVolume() {
  setInterval(() => {
    let cursor = (moment().unix() - 86400) * 1000;
    let size = 999999999999;

    authGet('/txs-new', { params: { cursor, size } }).then(res => {
      let txs = res.data.txs;

      console.log(txs);
    });
  }, 1000);
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

      return tx;
    });
  },
  getStakingTransaction(id) {
    return authGet('/staking-tx', { params: { id } }).then(res => {
      let tx = res.data.tx;

      return tx;
    });
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
