<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div class="transaction-page explorer-page page">
    <div class="transaction-body explorer-body">
      <div v-if="!firstLoading || (!loading && transaction)" class="container">
        <div class="explorer-card">
          <header>
            <h1>{{ isStaking ? 'Staking Transaction' : 'Transaction' }}</h1>
          </header>
          <div class="explorer-card-body">
            <table class="explorer-table">
              <tr v-if="isStaking">
                <td class="td-title">
                  Type:
                </td>
                <td>{{ transaction.type }}</td>
              </tr>
              <tr>
                <td class="td-title">
                  Hash:
                </td>
                <td>
                  {{ transaction.hash || $route.params.transactionId }}
                  <button
                    class="btn btn-light btn-icon-only"
                    v-on:click="eventClipBoardButton(transaction.hash)"
                  >
                    <font-awesome-icon :icon="['far', 'copy']" />
                  </button>
                </td>
              </tr>
              <tr>
                <td class="td-title">
                  Status:
                </td>
                <td>{{ transaction.status | txStatus }}</td>
              </tr>
              <tr v-if="isFailedTransaction">
                <td class="td-title">
                  Reason:
                </td>
                <td>{{ transaction.message }}</td>
              </tr>
              <tr>
                <td class="td-title">
                  Block:
                </td>
                <td>
                  <router-link :to="'/block/' + transaction.blockHash">
                    {{ Number(transaction.blockNumber) }}
                  </router-link>
                </td>
              </tr>
              <tr v-if="transaction.shardID === transaction.toShardID">
                <td class="td-title">
                  Shard:
                </td>
                <td>
                  <router-link :to="'/shard/' + transaction.shardID">
                    {{ transaction.shardID | number }}
                  </router-link>
                </td>
              </tr>
              <tr v-if="transaction.shardID !== transaction.toShardID">
                <td class="td-title">
                  From Shard:
                </td>
                <td>
                  <router-link :to="'/shard/' + transaction.shardID">
                    {{ transaction.shardID | number }}
                  </router-link>
                </td>
              </tr>
              <tr v-if="transaction.shardID !== transaction.toShardID">
                <td class="td-title">
                  To Shard:
                </td>
                <td>
                  <router-link :to="'/shard/' + transaction.toShardID">
                    {{ transaction.toShardID | number }}
                  </router-link>
                </td>
              </tr>
              <tr v-if="receipt">
                <td class="td-title">
                  Receiving shard block:
                </td>
                <td>
                  <router-link :to="'/block/' + receipt.blockHash">
                    {{ Number(receipt.blockNumber) }}
                  </router-link>
                </td>
              </tr>
              <tr>
                <td class="td-title">
                  Timestamp:
                </td>
                <td>
                  <font-awesome-icon :icon="['far', 'clock']" />
                  {{ Number(transaction.timestamp) * 1000 | age }}
                  ({{ (Number(transaction.timestamp) * 1000) | timestamp }})
                </td>
              </tr>
              
              <tr v-if="!isStaking">
                <td class="td-title">
                  From Address:
                </td>
                <td class="address_link">
                  <router-link
                    v-if="transaction.from"
                    :to="'/address/' + transaction.from"
                  >
                    {{ transaction.from }}
                  </router-link>
                  <button
                    class="btn btn-light btn-icon-only"
                    v-on:click="eventClipBoardButton(transaction.from)"
                  >
                    <font-awesome-icon :icon="['far', 'copy']" />
                  </button>

                </td>
              </tr>
              <tr v-if="!isStaking">
                <td class="td-title">
                  To Address
                </td>
                <td class="address_link">
                  <router-link
                    v-if="transaction.to"
                    :to="'/address/' + transaction.to"
                  >
                    {{ transaction.to }}
                  </router-link>
                  <button
                    class="btn btn-light btn-icon-only"
                    v-on:click="eventClipBoardButton(transaction.to)"
                  >
                    <font-awesome-icon :icon="['far', 'copy']" />
                  </button>
                </td>
              </tr>
              <tr v-if="isStaking">
                <td class="td-title">Validator Address</td>
                <td class="address_link">
                  <router-link
                    v-if="transaction.validator"
                    :to="
                      '/address/' + transaction.validator + '?txType=staking'
                    "
                  >
                    {{ transaction.validator }}
                  </router-link>
                  <span v-else>-</span>
                </td>
              </tr>
              <tr v-if="isStaking">
                <td class="td-title">Delegator Address</td>
                <td class="address_link">
                  <router-link
                    v-if="transaction.delegator"
                    :to="
                      '/address/' + transaction.delegator + '?txType=staking'
                    "
                  >
                    {{ transaction.delegator }}
                  </router-link>
                  <span v-else>-</span>
                </td>
              </tr>
              <tr>
                <td class="td-title">
                  Value:
                </td>
                <td v-if="isStaking && transaction.type === 'EditValidator'">
                  -
                </td>
                <td v-else>
                  {{ transaction.value | amount }} ONE (${{ getFiatValue(transaction.value) }})
                </td>
              </tr>
              <tr>
                <td class="td-title">
                  Transaction Fee:
                </td>
                <td>
                  {{ normalizedGas() }} ONE ${{ getFiatValue(Number(normalizedGas())) }})
                </td>
              </tr>
              <tr>
                <td class="td-title">
                  Gas Price:
                </td>
                <td>
                  {{ transaction.gasPrice }} Atto
                </td>
              </tr>
              <tr v-if="sequence">
                <td class="td-title">
                  Sequence:
                </td>
                <td>{{ sequence }}</td>
              </tr>
              <tr>
                <td class="td-title">
                  Nonce
                </td>
                <td>{{ parseInt(transaction.nonce) }}</td>
              </tr>
            </table>
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
import service from '../explorer/service';
import store from '../explorer/store';
import LoadingMessage from './LoadingMessage';
import ExpandPanel from '@/ui/ExpandPanel';
import VueJsonPretty from 'vue-json-pretty';

export default {
  name: 'TransactionPage',
  components: {
    LoadingMessage,
    ExpandPanel,
    VueJsonPretty,
  },
  props: {
    isStaking: {
      type: Boolean,
    },
  },
  data() {
    return {
      loading: true,
      firstLoading: true,
      transaction: null,
      receipt: null,
      sequence: null,
      globalData: store.data,
    };
  },
  computed: {
    isCrossShard() {
      return (
        this.transaction &&
        this.transaction.shardID === this.transaction.toShardID
      );
    },
    isFailedTransaction() {
      return this.transaction.status === 'FAILURE';
    },
  },
  watch: {
    $route() {
      this.firstLoading = true;
      this.getTransaction();
    },
  },
  mounted() {
    this.getTransaction();

    setTimeout(() => {
      console.log(this.transaction);
    },3000);
  },
  methods: {
    getSequence() {
      const data = this.transaction.input;
      if (!data) return;
      const re = /.+?7c7c((30|31|32|33|34|35|36|37|38|39|4c|52|55|44)+) 7c7c0*$/;
      const match = data.match(re);
      if (match && match[1] && match[1].length % 2 == 0) {
        this.sequence = this.hexToAscii(match[1]);
      }
    },
    getTransaction(txId) {
      const routeTxId = this.$route.params.transactionId;

      if (txId && txId !== routeTxId) {
        console.log(`transaction ${routeTxId} not found.`);
        return;
      }

      this.loading = true;

      const getTx = this.isStaking
        ? service.getStakingTransaction
        : service.getTransaction;

      getTx(routeTxId)
        .then(transaction => {
          if (
            transaction &&
            transaction.id &&
            transaction.id !== this.$route.params.transactionId
          ) {
            console.log(
              `transaction ${routeTxId} not found. data: ` +
                `${JSON.stringify(transaction)}`
            );
            return;
          }

          if (this.isStaking) {
            this.transaction = {
              ...transaction,
              validator: transaction.msg.validatorAddress,
              delegator: transaction.msg.delegatorAddress,
              value: transaction.msg.amount,
            };

            const { logs = [] } = transaction;

            if (transaction.type === 'CollectRewards' && logs.length) {
              this.transaction.value = logs[0].data;
            }
          } else {
            this.transaction = transaction;
          }

          this.firstLoading = false;

          if (transaction.status === 'PENDING') {
            setTimeout(() => this.getTransaction(routeTxId), 4000);
          }

          if (this.transaction.shardID !== this.transaction.toShardID) {
            service
              .getCxReceipt(this.$route.params.transactionId)
              .then(receipt => {
                this.receipt = receipt;
                console.log('receipt', receipt);
              });
          }
          this.getSequence();
        })
        .finally(() => (this.loading = false));
    },
    hexToUTF8(h) {
      try {
        let s = this.hexToAscii(h);
        return decodeURIComponent(escape(s));
      } catch (e) {
        return null;
      }
    },
    hexToAscii(h) {
      var s = '';
      for (var i = 0; i < h.length; i += 2) {
        s += String.fromCharCode(parseInt(h.substr(i, 2), 16));
      }
      return s;
    },
    normalizedGas() {
      const fee = isNaN(this.transaction.gas)
        ? 0
        : (Number(this.transaction.gas) * Number(this.transaction.gasPrice)) /
          10 ** 14 /
          10000;

      return Intl.NumberFormat('en-US', { maximumFractionDigits: 18 }).format(
        fee
      );
    },
    getFiatValue(value) {
      return (value * parseFloat(this.globalData.coinPrice)).toPrecision(2);
    },
    eventClipBoardButton(newClip) {
      const el = document.createElement('textarea');
      el.value = newClip;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    },
  },
};
</script>
