// This file handles all Harmony Node Websockets
import store from './store';

let wsBeaconNodeSocket = null;
let wsShardNodeSockets = [];

//-- Initializing functions --//
function ConnectBeaconWS() {
  if (
    wsBeaconNodeSocket == null ||
    wsBeaconNodeSocket.readyState === WebSocket.CLOSED
  ) {
    // connect
    // TODO handle all shards
    wsBeaconNodeSocket = new WebSocket(`wss://ws.s0.t.hmny.io`);

    wsBeaconNodeSocket.addEventListener('open', () => {
      console.log('NODE WS OPEN');

      wsBeaconNodeSocket.sLastCommand = '';

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
            name: v['name'],
            status: v['active-status'],
            rate: v['rate'],
            blocks_signed: v['lifetime']['blocks']['signed'],
            total_delegation: v['total-delegation'],
            website: v['website'],
          });
        }

        store.updateValidators(validators);
      }

      wsBeaconNodeSocket.sLastCommand = '';
    });
  }
}

function ConnectShardWS() {
  let shard_urls = [
    'wss://ws.s1.t.hmny.io',
    'wss://ws.s2.t.hmny.io',
    'wss://ws.s3.t.hmny.io',
  ];
}

//-- Reoccuring events --//
(function CheckConnection() {
  ConnectBeaconWS();

  setInterval(() => {
    ConnectBeaconWS();
  }, 5000);
})();

//-- Actions --//
function GetValidators() {
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
            0
        ]
    }`);
  } else {
    console.log('ERROR: Cannot connect node websocket');
  }
}

export default {
  GetValidators: GetValidators,
};
