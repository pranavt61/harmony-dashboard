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
  },
  watch: {
    globalData() {
      this.resetTimer();
    },
  },
  mounted() {
    this.resetTimer();

    // Update Validator data
    // Every 10 seconds
    setInterval(() => {
      NodeWebsocket.GetValidators();
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
  },
};
</script>
