// This file handles all Harmony Node Websockets
import store from './store';

let wsBeaconNodeSocket = null;
let wsShardNodeSockets = {};

//-- Initializing functions --//
function ConnectBeaconWS() {
  if (
    wsBeaconNodeSocket == null ||
    wsBeaconNodeSocket.readyState === WebSocket.CLOSED
  ) {
    // connect
    wsBeaconNodeSocket = new WebSocket(`wss://ws.s0.t.hmny.io`);

    wsBeaconNodeSocket.addEventListener('open', () => {
      console.log('NODE WS OPEN');

      GetValidators();
    });

    wsBeaconNodeSocket.addEventListener('message', function(event) {
      if (
        wsBeaconNodeSocket.sLastCommand === 'hmyv2_getAllValidatorInformation'
      ) {
        let data = JSON.parse(event.data).result;

        let validators = [];

        for (let i = 0; i < data.length; i++) {
          let v = data[i];

          validators.push({
            name: v['validator']['name'],
            status: v['active-status'],
            fee_rate: v['validator']['rate'],
            blocks_signed: v['lifetime']['blocks']['signed'],
            total_delegation: v['total-delegation'],
            website: v['validator']['website'],
          });
        }

        // Sort by stake
        validators.sort((a, b) => {
          return b.total_delegation - a.total_delegation;
        });

        // Limit to 20
        validators = validators.slice(0, 20);

        // Post processing
        for (let i = 0; i < validators.length; i++) {
          // Limit name to 20 chars
          if (validators[i].name.length > 20) {
            validators[i].name = validators[i].name.slice(0, 20) + '...';
          }

          // Prepend URLs is needed
          if (validators[i].website.slice(0, 8) !== 'https://') {
            validators[i].website = '//' + validators[i].website;
          }

          // Staking units
          validators[i].total_delegation =
            validators[i].total_delegation / 1000000000000000000;
        }

        // Push to store
        store.updateValidators(validators);
      }

      wsBeaconNodeSocket.sLastCommand = '';
    });

    // set last command
    wsBeaconNodeSocket.sLastCommand = '';
  }
}

function ConnectShardWS() {
  let shard_urls = {
    '0': 'wss://ws.s0.t.hmny.io',
    '1': 'wss://ws.s1.t.hmny.io',
    // '2' : 'wss://ws.s2.t.hmny.io', // TODO this one is broken
    '3': 'wss://ws.s3.t.hmny.io',
  };

  for (let i in shard_urls) {
    if (Object.prototype.hasOwnProperty.call(shard_urls, i)) {
      let url = shard_urls[i];

      if (
        wsShardNodeSockets[i] === undefined ||
        wsShardNodeSockets[i].readyState === WebSocket.CLOSED
      ) {
        // connect
        wsShardNodeSockets[i] = new WebSocket(url);

        wsShardNodeSockets[i].addEventListener('open', () => {
          console.log('SHARD NODE WS OPEN');

          GetPendingTransactions();
        });

        wsShardNodeSockets[i].addEventListener('message', function(event) {
          if (
            wsShardNodeSockets[i].sLastCommand === 'hmyv2_pendingTransactions'
          ) {
            let data = JSON.parse(event.data).result;

            let pendingTX = [];
            for (let t_i = 0; t_i < data.length; t_i++) {
              let tx = data[t_i];

              pendingTX.push({
                from: tx['from'],
                to: tx['to'],
                hash: tx['hash'],
                shard: tx['shardID'],
                value: tx['value'],
                shardID: tx['shardID'],
                toShardID: tx['toShardID'],
                gas: tx['gas'],
                gasPrice: tx['gasPrice'],
                nonce: tx['nonce'],
                status: 'PENDING',
              });
            }

            // Limit to 20
            pendingTX = pendingTX.slice(0, 20);

            store.updatePendingTransactions(pendingTX, i);
          }
        });

        wsShardNodeSockets[i].sLastCommand = '';
      }
    }
  }
}

//-- Reoccuring events --//
(function CheckConnection() {
  ConnectBeaconWS();
  ConnectShardWS();

  setInterval(() => {
    ConnectBeaconWS();
    ConnectShardWS();
  }, 5000);
})();

//-- Actions --//
function GetValidators() {
  // Check connection
  ConnectBeaconWS();

  if (
    wsBeaconNodeSocket !== null &&
    wsBeaconNodeSocket.readyState === WebSocket.OPEN
  ) {
    // SUCCESS
    wsBeaconNodeSocket.sLastCommand = 'hmyv2_getAllValidatorInformation';
    wsBeaconNodeSocket.send(`{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "hmyv2_getAllValidatorInformation",
        "params": [
            -1
        ]
    }`);
  } else {
    console.log('ERROR: Cannot connect beacon node websocket');
  }
}

function GetPendingTransactions() {
  // Check connection
  ConnectShardWS();

  for (let i in wsShardNodeSockets) {
    if (Object.prototype.hasOwnProperty.call(wsShardNodeSockets, i)) {
      let wsShard = wsShardNodeSockets[i];

      if (wsShard !== null && wsShard.readyState === WebSocket.OPEN) {
        // SUCCESS
        wsShard.sLastCommand = 'hmyv2_pendingTransactions';
        wsShard.send(`{
          "jsonrpc": "2.0",
          "id": 1,
          "method": "hmyv2_pendingTransactions",
          "params": []
        }`);
      } else {
        console.log('ERROR: Cannot connect shard ' + i + ' node websocket');
      }
    }
  }
}

export default {
  GetValidators: GetValidators,
  GetPendingTransactions: GetPendingTransactions,
};
