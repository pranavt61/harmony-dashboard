<style scoped lang="less">
@import '../less/common.less';
</style>

<template>
  <div class="block-page explorer-page page">
    <div class="block-body explorer-body">
      <div v-if="!loading && block" class="container">
        <div class="explorer-card">
          <header class="block-height-header">
            <h1>Block {{ block.height | number }}</h1>
            <router-link
              class="btn btn-light btn-icon-only"
              :to="'/block/' + block.prevBlock.id"
              tag="button"
            >
              <font-awesome-icon icon="chevron-left" />
            </router-link>
            <div v-if="block.nextBlock && block.nextBlock.id">
              <router-link
                class="btn btn-light btn-icon-only"
                :to="'/block/' + block.nextBlock.id"
                tag="button"
              >
                <font-awesome-icon icon="chevron-right" />
              </router-link>
            </div>
          </header>
          <div class="explorer-card-body">
            <section>
              <table class="explorer-table">
                <tr>
                  <td class="td-title">
                    Hash:
                  </td>
                  <td>
                    {{ block.id }}
                    <button
                      class="btn btn-light btn-icon-only"
                      v-on:click="eventClipBoardButton(block.id)"
                    >
                      <font-awesome-icon :icon="['far', 'copy']" />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td class="td-title">
                    Timestamp:
                  </td>
                  <td>
                    <font-awesome-icon :icon="['far', 'clock']" />
                    {{ block.timestamp | age }}
                    ({{ block.timestamp | timestamp }})
                  </td>
                </tr>
                <tr>
                  <td class="td-title">
                    Previous Block:
                  </td>
                  <td v-if="block.prevBlock && block.prevBlock.id">
                    <router-link :to="'/block/' + block.prevBlock.id">
                      {{ block.prevBlock.id }}
                    </router-link>
                    <button
                      class="btn btn-light btn-icon-only"
                      v-on:click="eventClipBoardButton(block.prevBlock.id)"
                    >
                      <font-awesome-icon :icon="['far', 'copy']" />
                    </button>
                  </td>
                  <td v-else>
                    -
                  </td>
                </tr>
                <tr>
                  <td class="td-title">
                    Next Block:
                  </td>
                  <td v-if="block.nextBlock && block.nextBlock.id">
                    <router-link :to="'/block/' + block.nextBlock.id">
                      {{ block.nextBlock.id }}
                    </router-link>
                    <button
                      class="btn btn-light btn-icon-only"
                      v-on:click="eventClipBoardButton(block.nextBlock.id)"
                    >
                      <font-awesome-icon :icon="['far', 'copy']" />
                    </button>
                  </td>
                  <td v-else>
                    -
                  </td>
                </tr>
                <tr>
                  <td class="td-title">
                    Transactions:
                  </td>
                  <td>
                    <router-link :to="'/block/' + block.id + '/txs'">
                      {{ block.txCount | number }}
                    </router-link>
                  </td>
                </tr>
                <tr>
                  <td class="td-title">
                    Staking Transactions:
                  </td>
                  <td>
                    <router-link :to="'/block/' + block.id + '/txs'">
                      {{ block.stakingTxCount | number }}
                    </router-link>
                  </td>
                </tr>
                <tr>
                  <td class="td-title">
                    Shard:
                  </td>
                  <td>
                    <router-link :to="'/shard/' + block.shardID">
                      {{ block.shardID | number }}
                    </router-link>
                  </td>
                </tr>
                <tr>
                  <td class="td-title">
                    Epoch:
                  </td>
                  <td>{{ parseInt(block.epoch) }}</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Gas Used:
                  </td>
                  <td>
                    {{ parseInt(block.gasUsed) }} ({{ getGasUsedPercent() }}%)
                  </td>
                </tr>
                <tr>
                  <td class="td-title">
                    Gas Limit:
                  </td>
                  <td>
                    {{ parseInt(block.gasLimit) }}
                  </td>
                </tr>
                <tr>
                  <td class="td-title">
                    Size:
                  </td>
                  <td>{{ block.bytes }} bytes</td>
                </tr>
                <tr>
                  <td class="td-title">
                    Validating Leader:
                  </td>
                  <td>
                    <router-link :to="'/address/' + block.miner">
                      {{ block.miner }}
                    </router-link>
                    <button
                      class="btn btn-light btn-icon-only"
                      v-on:click="eventClipBoardButton(block.miner)"
                    >
                      <font-awesome-icon :icon="['far', 'copy']" />
                    </button>
                  </td>
                </tr>
                <tr v-if="block.extraData">
                  <td class="td-title">
                    Extra Data:
                  </td>
                  <td>{{ block.extraData }}</td>
                </tr>
              </table>
            </section>
          </div>
          <div v-if="block.txCount > 0">
            <div class="explorer-card-body">
              <section>
                <h2>Transactions</h2>
                <table class="explorer-table">
                  <tr>
                    <th>Hash</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Value</th>
                    <th class="text-right">
                      Gas Used
                    </th>
                  </tr>
                  <tr v-for="tx in block.txs" :key="tx.id">
                    <td>
                      <router-link :to="'/tx/' + tx.id">
                        {{ tx.id.substring(0, 20) }}...
                      </router-link>
                    </td>
                    <td>
                      <router-link :to="'/address/' + tx.from">
                        {{ tx.from.bech32.substring(0, 20) }}...
                      </router-link>
                    </td>
                    <td>
                      <router-link :to="'/address/' + tx.to">
                        {{ tx.to.bech32.substring(0, 20) }}...
                      </router-link>
                    </td>
                    <td>{{ Number(tx.value) / 1000000000000000000 }}</td>
                    <td class="text-right">
                      {{ parseInt(tx.gas) }}
                    </td>
                  </tr>
                </table>
              </section>
            </div>
          </div>
          <div v-if="block.stakingTxCount > 0">
            <div class="explorer-card-body">
              <section>
                <h2>Staking Transactions</h2>
                <table class="explorer-table">
                  <tr>
                    <th>
                      Shard
                    </th>
                    <th>TxHash</th>
                    <th>Type</th>
                    <th>Validator</th>
                    <th>Delegator</th>
                    <th>Value</th>
                    <th class="text-right">Fee</th>
                  </tr>
                  <tr v-for="tx in block.stakingTxs" :key="tx.hash">
                    <td>
                      {{ tx.shardID }}
                    </td>
                    <td>
                      <router-link :to="'/staking-tx/' + tx.hash">
                        {{ tx.id.substring(0, 20) }}...
                      </router-link>
                    </td>
                    <td>
                      {{ tx.type }}
                    </td>
                    <td>
                      <div v-if="tx.validator.bech32 !== ''">
                        <router-link
                          v-if="tx.validator"
                          :to="'/address/' + tx.validator.bech32 + '?txType=staking'"
                        >
                          {{ tx.validator.bech32.substring(0, 20) }}...
                        </router-link>
                      </div>
                      <div v-else>
                        -
                      </div>
                    </td>
                    <td>
                      <div v-if="tx.delegator.bech32 !== ''">
                        <router-link
                          v-if="tx.delegator"
                          :to="'/address/' + tx.delegator.bech32 + '?txType=staking'"
                        >
                          {{ tx.delegator.bech32.substring(0, 20) }}...
                        </router-link>
                      </div>
                      <div v-else>
                        -
                      </div>
                    </td>
                    <td class="no-break">
                      {{ tx.value | amount }}
                    </td>
                    <td class="no-break text-right">
                      {{ tx | fee }}
                    </td>
                  </tr>
                </table>
              </section>
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
import service from '../explorer/service'
import LoadingMessage from './LoadingMessage'

export default {
  name: 'BlockPage',
  components: {
    LoadingMessage,
  },
  data() {
    return {
      loading: true,
      block: null,
    }
  },
  watch: {
    $route() {
      this.getBlock()
    },
  },
  mounted() {
    this.getBlock()
  },
  methods: {
    getBlock() {
      this.loading = true
      service
        .getBlock(this.$route.params.blockId)
        .then(block => (this.block = block))
        .finally(() => (this.loading = false))
    },
    getGasUsedPercent() {
      if (this.block == undefined) {
        return 0;
      }

      let gas_used = parseInt(this.block.gasUsed);
      let gas_limit = parseInt(this.block.gasLimit);

      return (gas_used / gas_limit) * 100;
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
}
</script>
