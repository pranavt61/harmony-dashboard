<style scoped lang="less">
@import '../less/common.less';
.shard {
  width: 25%;
  display: inline-block;

  td {
    word-break: unset;
  }

  .td-title {
    width: 11em;
  }

  .explorer-card-body {
    min-height: auto;
    padding-right: 0;
  }
}

.explorer-card-body {
  min-height: 24em;
  box-sizing: content-box;
}

.home-body {
  flex: 1;
  width: 100%;
  background-size: cover;
  background-position: bottom center;
  color: var(--primary-text-color);
  display: flex;
  header {
    .flex-horizontal;
    align-items: flex-end;
  }

  .latest-block-card {
    table {
      th {
        position: sticky;
        top: 0;
        background-color: var(--color-card-background);
      }
      height: 20em;
      overflow: auto;
    }
  }

  .total-txs {
    margin-right: 20px;
  }

  .header-no-dropdown {
    padding-bottom: 20px;
    padding-top: 20px;
  }
}

.show-more-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;

  .show-more-button {
    padding: 6px 25px;
    border: 1px solid #008ddc50;
    border-radius: 5px;
    transition: all 0.3s;

    font-weight: 400;
    font-size: 0.9em;

    &:hover {
      /*border: 1px solid #1b295e;*/
      /*color: #1b295e;*/
    }
  }
}
</style>

<template>
  <div class="home-page explorer-page page">
    <div class="home-body explorer-body">
      <div v-if="globalData.blocks.length" class="container">
        <div v-if="!!coinStats" class="explorer-card status-card">
          <CoinStats :stats="coinStats" />
        </div>
        <div class="explorer-card status-card">
          <div class="row">
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-block-count" />
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">
                    {{ globalData.blockCount | number }}
                  </div>
                  <h1>Block Count</h1>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-tx-count" />
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">
                    {{ globalData.blockLatency | blockLatency }}
                  </div>
                  <h1>Block Latency</h1>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-market-cap" />
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">
                    {{ globalData.marketCap | number }}
                  </div>
                  <h1>Market Cap</h1>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <div class="flex-horizontal">
                <div class="icon-column">
                  <div class="data-icon-circle">
                    <div class="data-icon icon-coin-price" />
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">
                    {{ Math.round(globalData.coinPrice * 10000) / 10000 }}
                  </div>
                  <h1>Coin Price</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <div class="explorer-card latest-block-card">
              <header>
                <h1 class="flex-grow">
                  Latest Blocks
                </h1>
                <div class="secondary-info">
                  <select v-model="selectedBlocksShard">
                    <option value="-1">
                      All Shards
                    </option>
                    <option
                      v-for="shard in globalData.shards"
                      :key="shard.id"
                      :value="shard.id"
                    >
                      Shard {{ shard.id }}
                    </option>
                  </select>
                </div>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-table-responsive latest-block-table">
                  <div class="tr">
                    <div class="th">
                      Shard
                    </div>
                    <div class="th">
                      Hash
                    </div>
                    <div class="th">
                      Height
                    </div>
                    <div class="th text-right">
                      Age
                    </div>
                  </div>
                  <div
                    v-for="block in filterBlocksByShards"
                    :key="block.id"
                    class="tr"
                  >
                    <div class="td">
                      <router-link :to="'/shard/' + block.shardID">
                        {{ block.shardID }}
                      </router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/block/' + block.id">
                        {{ block.id.substring(0, 8) }}...
                      </router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/block/' + block.id">
                        {{ block.height | number }}
                      </router-link>
                    </div>
                    <div class="td text-right">
                      {{ block.timestamp | age }}
                    </div>
                  </div>
                </div>
              </div>
              <footer class="button-only-footer">
                <router-link
                  tag="button"
                  class="btn btn-light btn-block btn-mini"
                  to="blocks"
                >
                  Show all blocks
                </router-link>
              </footer>
            </div>
          </div>
          <div v-if="!showStaking" class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <div class="explorer-card latest-block-card">
              <header class="header-no-dropdown">
                <h1 class="flex-grow">
                  Validators
                </h1>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-table-responsive latest-tx-table">
                  <div class="tr">
                    <div class="th">
                      Name
                    </div>
                    <div class="th">
                      Fee Rate
                    </div>
                    <div class="th text-right">
                      Total Stake
                    </div>
                  </div>
                  <div
                    v-for="v in globalData.validators"
                    :key="v.name"
                    class="tr"
                  >
                    <div class="td">
                      <a :href="v.website" target="_blank">
                        {{ v.name }}
                      </a>
                    </div>
                    <div class="td">
                      {{
                        Math.round(parseFloat(v.fee_rate) * 10000) / 100 + '%'
                      }}
                    </div>
                    <div class="td text-right">
                      {{ Math.round(v.total_delegation) | number }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <div class="explorer-card latest-block-card">
              <header>
                <h1 class="flex-grow">
                  Latest Transactions
                </h1>
                <div class="secondary-info">
                  <select v-model="selectedTransactionsShard">
                    <option value="-1">
                      All Shards
                    </option>
                    <option
                      v-for="shard in globalData.shards"
                      :key="shard.id"
                      :value="shard.id"
                    >
                      Shard {{ shard.id }}
                    </option>
                  </select>
                </div>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-table-responsive latest-tx-table">
                  <div class="tr">
                    <div class="th">
                      Shard
                    </div>
                    <div class="th">
                      Hash
                    </div>
                    <div class="th">
                      Value
                    </div>
                    <div class="th text-right">
                      Age
                    </div>
                  </div>
                  <div
                    v-for="tx in filterTransactionsByShards"
                    :key="tx.id"
                    class="tr"
                  >
                    <div class="td">
                      <router-link :to="'/shard/' + tx.shardID">
                        {{ tx.shardID }}
                      </router-link>
                    </div>
                    <div class="td">
                      <router-link :to="'/tx/' + tx.id">
                        {{ tx.id.substring(0, 8) }}...
                      </router-link>
                    </div>
                    <div class="td">
                      {{ tx.value | amount }}
                    </div>
                    <div class="td text-right">
                      {{ tx.timestamp | age }}
                    </div>
                  </div>
                </div>
              </div>
              <footer class="button-only-footer">
                <router-link
                  tag="button"
                  class="btn btn-light btn-block btn-mini"
                  to="txs"
                >
                  Show all transactions
                </router-link>
              </footer>
            </div>
          </div>
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <div class="explorer-card latest-block-card">
              <header>
                <h1 class="flex-grow">
                  Pending Transactions
                </h1>
                <div class="secondary-info">
                  <select v-model="selectedPendingTransactionsShard">
                    <option value="-1">
                      All Shards
                    </option>
                    <option
                      v-for="shard in globalData.shards"
                      :key="shard.id"
                      :value="shard.id"
                    >
                      Shard {{ shard.id }}
                    </option>
                  </select>
                </div>
              </header>
              <div class="explorer-card-body">
                <div class="explorer-table-responsive latest-tx-table">
                  <div class="tr">
                    <div class="th">
                      Shard
                    </div>
                    <div class="th">
                      Hash
                    </div>
                    <div class="th text-right">
                      Value
                    </div>
                  </div>
                  <div
                    v-for="tx in filterPendingTransactionsByShards"
                    :key="tx.hash"
                    class="tr"
                  >
                    <div class="td">
                      {{ tx.shard }}
                    </div>
                    <div class="td">{{ tx.hash.substring(0, 40) }}...</div>
                    <div class="td text-right">
                      {{ tx.value | amount }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="explorer-card latest-block-card">
              <header>
                <h1 class="flex-grow">
                  Transaction Volume (24 Hour)
                </h1>
              </header>
              <div class="explorer-card-body">
                <canvas id="Transaction-Volume-Chart"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSfpQ1qJjBNwonJU0Ls0GX9NR7nd0zwWQMTYPX--mQW8earWSA/viewform?embedded=true"
              width="100%"
              height="1000"
              frameborder="0"
              marginheight="0"
              marginwidth="0"
              class="flex-grow"
            >
              Loading…
            </iframe>
          </div>
        </div>
      </div>
      <div v-else class="container">
        <loading-message />
      </div>
    </div>
  </div>
</template>

<script>
import store from '../explorer/store';
import NodeWebsocket from '../explorer/node-websocket';
import LoadingMessage from './LoadingMessage';
import CoinStats from './CoinStats';
import Chart from 'chart.js';

export default {
  name: 'HomePage',
  components: {
    LoadingMessage,
    CoinStats,
  },
  data() {
    return {
      globalData: store.data,
      pageIndex: 0,
      pageSize: 50,
      timer: null,
      now: Date.now(),
      showTx: true,
      coinStats: null,
      selectedBlocksShard: '-1',
      selectedTransactionsShard: '-1',
      selectedPendingTransactionsShard: '-1',
    };
  },
  computed: {
    length() {
      return Math.ceil(this.globalData.blocks.length / this.pageSize)
    },
    showWhich() {
      return this.$route.query.txType || 'regular' // 'staking','regular','hrc20';
    },
    tabValue() {
      const status = { staking: 1, regular: 0, hrc20: 2 }
      return status[this.$route.query.txType] || 0
    },
    lastBlocks() {
      return Object.values(this.$store.data.shards).map(
        shard => shard.blocks[0]
      )
    },
    Hrc20Address() {
      return this.$store.data.Hrc20Address
    },
    Hrc20Txs() {
      return this.$store.data.hrc20Txs.reduce((list, tx) => {
        const c = this.$store.data.hmy.contract(this.$store.data.HRC20_ABI)
        const decodeObj = c.decodeInput(tx.input)
        if (decodeObj.abiItem && decodeObj.abiItem.name == 'transfer')
          list.push({
            tx,
            hrc20tx: {
              from: tx.from,
              to: decodeObj.params[0],
              amount: decodeObj.params[1],
            },
          })
        else if (decodeObj.abiItem && decodeObj.abiItem.name == 'transferFrom')
          list.push({
            tx,
            hrc20tx: {
              from: decodeObj.params[0],
              to: decodeObj.params[1],
              amount: decodeObj.params[2],
            },
          })
        return list
      }, [])
    },
    filterBlocksByShards() {
      const selectedShard = this.selectedBlocksShard;

      if (selectedShard === '-1') {
        return this.globalData.blocks;
      }

      return this.globalData.shards[selectedShard].blocks;
    },
    filterTransactionsByShards() {
      const selectedShard = this.selectedTransactionsShard;

      if (selectedShard == '-1') {
        return this.globalData.txs;
      }

      return this.globalData.shards[selectedShard].txs;
    },
    filterPendingTransactionsByShards() {
      const selectedShard = this.selectedPendingTransactionsShard;
      const pendingTxs = this.globalData.pendingTxs;

      if (selectedShard == '-1') {
        let txs = [];

        for (let shard in pendingTxs) {
          if (Object.prototype.hasOwnProperty.call(pendingTxs, shard)) {
            txs.push.apply(txs, pendingTxs[shard]);
          }
        }

        return txs;
      }

      return pendingTxs[selectedShard];
    },
  },
  watch: {
    globalData() {
      this.resetTimer()
    },
    Hrc20Address() {
      this.updateHolders()
    },
  },
  mounted() {
    this.resetTimer();

    this.updateTransactionVolumeChart();

    // Update Validator data
    // Update Pending Transaction data
    // Every 10 seconds
    setInterval(() => {
      NodeWebsocket.GetValidators();
      NodeWebsocket.GetPendingTransactions();
    }, 10000);
  },
  methods: {
    hrc20info(id) {
      return this.$store.data.Hrc20Address[id]
    },
    hrc20Balance(id, amount) {
      if (!this.hrc20info(id)) {
        return amount
      }

      return (
        displayAmount(amount, this.hrc20info(id).decimals) +
        ' ' +
        this.hrc20info(id).symbol
      )
    },
    async updateHolders() {
      let tokenHolders = []
      for (let hrc20 in this.Hrc20Address)
        tokenHolders.push({ id: hrc20, holders: 10000 })
      this.tokenHolders = tokenHolders
    },
    bech32(hexaddr) {
      return this.$store.data.hmy.hmySDK.crypto.toBech32(hexaddr)
    },
    changeTab(value) {
      let txType = 'regular'
      if (value == 1) txType = 'staking'
      if (value == 2) txType = 'hrc20'
      this.$router.replace({
        name: 'HomePage',
        query: { txType },
      })
    },
    resetTimer() {
      clearInterval(this.timer)
      this.now = Date.now()
      this.timer = setInterval(() => {
        this.now = Date.now()
      }, 1000)
    },
    updateTransactionVolumeChart() {
      setInterval(() => {
        let timestamps = this.globalData.txVolume;

        timestamps.sort();

        let min_ts = timestamps[0];
        let max_tx = timestamps[timestamps.length - 1];

        let data = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < timestamps.length; i++) {
          if (timestamps[i] === max_tx) {
            data[data.length - 1]++;
            continue;
          }
          let index = Math.floor(
            (timestamps[i] - min_ts) / ((max_tx - min_ts) / data.length)
          );
          data[index]++;
        }

        const ctx = document.getElementById('Transaction-Volume-Chart');
        const myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['24', '20', '16', '12', '8', '4'],
            datasets: [
              {
                label: '',
                data: data,
                backgroundColor: [
                  'rgba(95, 44, 130, 0.2)',
                  'rgba(95, 44, 130, 0.2)',
                  'rgba(95, 44, 130, 0.2)',
                  'rgba(95, 44, 130, 0.2)',
                  'rgba(95, 44, 130, 0.2)',
                  'rgba(95, 44, 130, 0.2)',
                ],
                borderColor: [
                  'rgba(95, 44, 130, 1)',
                  'rgba(95, 44, 130, 1)',
                  'rgba(95, 44, 130, 1)',
                  'rgba(95, 44, 130, 1)',
                  'rgba(95, 44, 130, 1)',
                  'rgba(95, 44, 130, 1)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            animation: {
              duration: 0,
            },
            legend: {
              display: false,
            },
            scales: {
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Hours Ago',
                  },
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Frequency',
                  },
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          },
        });
      }, 3000);
    },
  },
}
</script>
