<style scoped lang="less">
@import '../less/common.less';

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
                    <div class="td">
                      <router-link :to="'/tx/' + tx.hash">
                        {{ tx.hash.substring(0, 32) }}...
                      </router-link>
                    </div>
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
                  Transaction Volume
                </h1>
                <div class="secondary-info">
                  <select v-model="selectedTransactionVolumeTimeframe">
                    <option value="24">
                      24 hours
                    </option>
                    <option value="168">
                      7 days
                    </option>
                    <option value="720">
                      1 month
                    </option>
                    <option value="8760">
                      1 year
                    </option>
                    <option value="-1">
                      All time
                    </option>
                  </select>
                </div>
              </header>
              <div class="explorer-card-body">
                <div id="Transaction-Volume-Body"></div>
                <div v-if="loadingTransactionVolumeChart">
                  <loading-message />
                </div>
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
import service from '../explorer/service';
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

      loadingTransactionVolumeChart: true,

      selectedBlocksShard: '-1',
      selectedTransactionsShard: '-1',
      selectedPendingTransactionsShard: '-1',
      selectedTransactionVolumeTimeframe: '24', // hours
    };
  },
  computed: {
    length() {
      return Math.ceil(this.globalData.blocks.length / this.pageSize);
    },
    showStaking() {
      return this.$route.query.txType === 'staking' ? true : false;
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
      this.resetTimer();
    },
    selectedTransactionVolumeTimeframe: function(val) {
      this.updateTransactionVolumeChart();
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
    changeTab(value) {
      this.$router.replace({
        name: 'HomePage',
        query: { txType: value ? 'staking' : 'regular' },
      });
    },
    resetTimer() {
      clearInterval(this.timer);
      this.now = Date.now();
      this.timer = setInterval(() => {
        this.now = Date.now();
      }, 1000);
    },
    updateTransactionVolumeChart() {
      
      // set loading animation
      this.loadingTransactionVolumeChart = true;

      // remove canvas element
      let chart_canvas_el_rem = document.getElementById("Transaction-Volume-Chart");
      if (chart_canvas_el_rem != null) {
        chart_canvas_el_rem.parentNode.removeChild(chart_canvas_el_rem);
      }

      let min_height = 0;
      let max_height = 0;

      service.getMaxBlockHeightTransactionVolume().then(res => {
        // Get current block height 

        let height = res.data['height']

        let block_range = 0;

        if (this.selectedTransactionVolumeTimeframe !== '-1') {
          // selectedTransactionVolumeTimeframe is selected by hours,
          // convert to seconds
          // then convert to blocks

          block_range = (parseInt(this.selectedTransactionVolumeTimeframe) * 3600) / 5;
        } else {
          // selected all time
          block_range = height;
        }

        min_height = height - block_range;
        max_height = height;

        return service.getTransactionVolume(min_height);
      }).then(res => {
        // Get transaction volume

        // stop loading animation
        this.loadingTransactionVolumeChart = false;

        // add canvas element
        let chart_canvas_el_add = document.createElement("CANVAS");
        chart_canvas_el_add.setAttribute('id', "Transaction-Volume-Chart");
        document.getElementById("Transaction-Volume-Body").appendChild(chart_canvas_el_add);

        let timestamps = res.data;

        let num_bars = 40;
        
        let data = [];
        for (let i = 0; i < num_bars; i ++) {
          data.push(0);
        }

        let labels = [];
        let num_labels = 5;
        for (let i = 0; i < num_bars; i ++) {
          if (i % Math.floor(num_bars / num_labels) == 0) {
            let time_selected = parseInt(this.selectedTransactionVolumeTimeframe);
            if (time_selected == -1) {
              // Selected all time
              // HARDCODED
              // Timestamp of first block in shard 0 is        1561736306
              time_selected = (Math.floor(Date.now() / 1000) - 1561736306);

              // convert seconds to hours
              time_selected = Math.floor(time_selected / 3600);
            }

            let ts = Math.round(new Date().getTime() / 1000);
            let hoursAgo = time_selected - Math.floor((i * time_selected) / num_bars); 
            let dateAgo = new Date((ts - (hoursAgo * 3600)) * 1000);
            
            if (time_selected == 24) {
              // hour labels
              let h = dateAgo.getHours();
              let m = '00';

              var AMPM = (h >= 12)? " PM":" AM";
              if (h > 12) h = h - 12;
              if (h < 1) h = h + 12;

              labels.push(h + ':' + m + AMPM);
            } else {
              // date labels
              let m = dateAgo.getMonth();
              let d = dateAgo.getDate();

              // only show year when selected All Time
              let y = (this.selectedTransactionVolumeTimeframe == '-1') ?
                (' ' + dateAgo.getFullYear()) : '';

              m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m];

              labels.push(m + " '" + d + y);
            }
          } else {
            labels.push('');
          }
        }

        let backgroundColor = [];
        for (let i = 0; i < num_bars; i ++) {
          backgroundColor.push('rgba(95, 44, 130, 0.2)');
        }

        let borderColor = [];
        for (let i = 0; i < num_bars; i ++) {
          backgroundColor.push('rgba(95, 44, 130, 1)');
        }

        for (let i = 0; i < timestamps.length; i++) {
          let height = timestamps[i]['Block_height'];
          let tx_count = timestamps[i]['Tx_count'];
          if (height == max_height) {
            continue;
          }

          let index = Math.floor(((height - min_height) / (max_height - min_height)) * data.length);

          data[index] += tx_count;
        }
        
        // Render transaction volume
        const ctx = document.getElementById('Transaction-Volume-Chart');
        const myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: '',
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
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
                    display: false
                  },
                  ticks: {
                    maxRotation: 0,
                    minRotation: 0
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

      });

      return;
    },
  },
};
</script>
