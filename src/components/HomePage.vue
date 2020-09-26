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
  overflow-x: hidden;
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

.pending-tx-table-empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.search-bar-body {
  padding: 30px 40px 50px 60px;
  text-align: center;
  margin: 0 -601.5rem;
  background: linear-gradient(0deg, white 50%, #5f2c82 50%);
}


.search-bar-input {
  width: 800px;
  height: 40px;

  font-size: 15px;

  padding: 30px 30px !important;
  border: 0px !important;
  border-radius: 5px !important;
  box-shadow: 0 0 0.4em rgba(0, 0, 0, 0.5);
	outline: none;

}
input:focus {
  outline:none !important;
}

</style>

<template>
  <div class="home-page explorer-page page">
    <div class="home-body explorer-body">
      <div v-if="globalData.blocks.length" class="container">
        <div class="search-bar-body">
          <input
            type="text"
            placeholder="Search for Blocks / Transactions / Accounts..."
            class="search-bar-input"
            v-model="textSearchBar"
            @keyup.enter="searchQuery()"
          />
        </div>
        <div v-if="!!coinStats" class="explorer-card status-card">
          <CoinStats :stats="coinStats" />
        </div>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
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
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
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
          <div v-if="!showStaking" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <div class="explorer-card latest-block-card">
              <header class="header-no-dropdown">
                <h1 class="flex-grow">
                  Top Validators
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
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
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
                <div
                  v-if="emptyPendingTransactions"
                  class="pending-tx-table-empty-container"
                >
                  <h3 class="pending-tx-table-empty-message">
                    No Pending Transactions
                  </h3>
                </div>
                <div v-else>
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

      textSearchBar: '',

      loadingTransactionVolumeChart: true,

      selectedBlocksShard: '-1',
      selectedTransactionsShard: '-1',
      selectedPendingTransactionsShard: '-1',
      selectedTransactionVolumeTimeframe: '48', // hours
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
    emptyPendingTransactions() {
      const selectedShard = this.selectedPendingTransactionsShard;
      const pendingTxs = this.globalData.pendingTxs;

      if (selectedShard == '-1') {
        for (let shard in pendingTxs) {
          if (Object.prototype.hasOwnProperty.call(pendingTxs, shard)) {
            if (pendingTxs[shard].length > 0) return false;
          }
        }

        return true;
      }

      return (pendingTxs[selectedShard].length === 0);
    }
  },
  watch: {
    globalData() {
      this.resetTimer();
    },
  },
  mounted() {

    this.resetTimer();

    this.updateCoinStats();
    setInterval(this.updateCoinStats, 10000);

    // Update Validator data
    // Update Pending Transaction data
    // Every 10 seconds
    setInterval(() => {
      NodeWebsocket.GetValidators();
      NodeWebsocket.GetPendingTransactions();
    }, 30000);
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
    searchQuery() {
      let input = this.textSearchBar.trim();
      this.textSearchBar = '';

      // is block height?
      if (parseInt(input) !== NaN) {
        service
          .getBlockHashByNumber(parseInt(input))
          .then(result => {
            let hash = result['data']['hash'];

            this.$router.push(`/block/${hash}`);
          });

          return;
      }

      // is pending?
      let pendingTxs = store.data.pendingTxs;
      for (let shard_id in pendingTxs) {
        if (pendingTxs.hasOwnProperty(shard_id)) {
          for (let i = 0; i < pendingTxs[shard_id].length; i ++) {
            if (pendingTxs[shard_id][i]['hash'] == input) {
              this.$router.push(`/tx/${input}`);
              return;
            }
          }
        }
      }

      service
        .search(input)
        .then(result => {
          if (result.type === 'block') {
            this.$router.push(`/block/${input}`);
          } else if (result.type === 'tx') {
            this.$router.push(`/tx/${input}`);
          } else if (result.type === 'address') {
            this.$router.push(`/address/${input}`);
          } else {
            alert('invalid search query');
          }
        })
        .catch(r => {
          alert('invalid search query')
        });
    },
    updateCoinStats() {
      service.getCoinStats()
        .then(result => {

          this.coinStats = result['coin'];
        });
    },
  },
};
</script>
