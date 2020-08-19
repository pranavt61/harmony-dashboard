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
                    <div class="data-icon icon-node-count" />
                  </div>
                </div>
                <div class="data-num-column">
                  <div class="data-num">
                    {{ globalData.nodeCount | number }}
                  </div>
                  <h1>Node Count</h1>
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
                    {{ globalData.coinPrice | number }}
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
                <select v-model="selectedBlocksShard" class="flex-grow">
                  <option>All Shards</option>
                  <option>Shard 0</option>
                  <option>Shard 1</option>
                  <option>Shard 2</option>
                  <option>Shard 3</option>
                </select>
                <div class="secondary-info">
                  <div class="timer">
                    Updated
                    {{
                      Math.round(
                        Math.max((now - globalData.lastUpdateTime) / 1000, 0)
                      ) | number
                    }}s ago...
                  </div>
                  <span class="total-block-num" />
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
                        {{ block.id | shorten }}
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
              <header>
                <h1 class="flex-grow">
                  Latest Transactions
                </h1>
                <select v-model="selectedTransactionsShard" class="flex-grow">
                  <option>All Shards</option>
                  <option>Shard 0</option>
                  <option>Shard 1</option>
                  <option>Shard 2</option>
                  <option>Shard 3</option>
                </select>
                <div class="secondary-info">
                  <div class="timer">
                    Updated
                    {{
                      Math.round(
                        Math.max((now - globalData.lastUpdateTime) / 1000, 0)
                      ) | number
                    }}s ago...
                  </div>
                  <span class="total-block-num" />
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
                        {{ tx.id | shorten }}
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
import LoadingMessage from './LoadingMessage';
import CoinStats from './CoinStats';

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
      selectedBlocksShard: 'All Shards',
      selectedTransactionsShard: 'All Shards',
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
      // TODO Does not work with variable amount of shards

      return this.globalData.blocks.filter(block => {
        const selectedShard = this.selectedBlocksShard;

        let shardID = -1;
        if (selectedShard == 'All Shards') {
          return true;
        } else if (selectedShard == 'Shard 0') {
          shardID = 0;
        } else if (selectedShard == 'Shard 1') {
          shardID = 1;
        } else if (selectedShard == 'Shard 2') {
          shardID = 2;
        } else if (selectedShard == 'Shard 3') {
          shardID = 3;
        }

        if (block.shardID == shardID) {
          return true;
        }

        return false;
      });
    },
    filterTransactionsByShards() {
      // TODO Does not work with variable amount of shards

      return this.globalData.txs.filter(tx => {
        const selectedShard = this.selectedTransactionsShard;

        let shardID = -1;
        if (selectedShard == 'All Shards') {
          return true;
        } else if (selectedShard == 'Shard 0') {
          shardID = 0;
        } else if (selectedShard == 'Shard 1') {
          shardID = 1;
        } else if (selectedShard == 'Shard 2') {
          shardID = 2;
        } else if (selectedShard == 'Shard 3') {
          shardID = 3;
        }

        if (tx.shardID == shardID) {
          return true;
        }

        return false;
      });
    },
  },
  watch: {
    globalData() {
      this.resetTimer();
    },
  },
  mounted() {
    this.resetTimer();

    // service.getCoinStats().then(stats => {
    //   this.coinStats = stats;
    // });
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
  },
};
</script>
