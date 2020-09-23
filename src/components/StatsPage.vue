<style scoped lang="less">
@import '../less/common.less';

.dropbtn {
  border: none;
  cursor: pointer;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

.chart-header {
  font-size: 15px;
  padding: 10px 0px;
  color: #1b295e;
}

</style>

<template>
  <div class="explorer-page page">
    <div class="explorer-body">
      <div class="container">
        <div class="header-spacing" />
        <header class="block-height-header">
          <h1>Stats and Charts</h1>
        </header>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="explorer-card">
              <header>
                <h1 class="flex-grow">
                  ONE TRANSACTION HISTORY IN {{ selectedTransactionVolumeTimeframeLabel }}
                </h1>
                <div class="secondary-info">
                  <div class="dropdown">
                    <button class="dropbtn btn btn-light btn-icon-only">
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                    <div class="dropdown-content">
                      <a href="#" @click.prevent="setTransactionChartTimeframe(48, '2 DAYS')">2 Days</a>
                      <a href="#" @click.prevent="setTransactionChartTimeframe(336, '14 DAYS')">14 Days</a>
                      <a href="#" @click.prevent="setTransactionChartTimeframe(720, '30 DAYS')">30 Days</a>
                      <a href="#" @click.prevent="setTransactionChartTimeframe(8544, '1 YEAR')">1 Year</a>
                      <a href="#" @click.prevent="setTransactionChartTimeframe(-1, 'ALL TIME')">All Time</a>
                    </div>
                  </div>
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
            <div class="explorer-card">
              <header>
                <h1 class="flex-grow">
                  ONE GAS USED IN {{ selectedTransactionVolumeTimeframeLabel }}
                </h1>
                <div class="secondary-info">
                  <div class="dropdown">
                    <button class="dropbtn btn btn-light btn-icon-only">
                      <font-awesome-icon icon="chevron-down" />
                    </button>
                    <div class="dropdown-content">
                      <a href="#" @click.prevent="setGasUsedChartTimeframe(48, '2 DAYS')">2 Days</a>
                      <a href="#" @click.prevent="setGasUsedChartTimeframe(336, '14 DAYS')">14 Days</a>
                      <a href="#" @click.prevent="setGasUsedChartTimeframe(720, '30 DAYS')">30 Days</a>
                      <a href="#" @click.prevent="setGasUsedChartTimeframe(8544, '1 YEAR')">1 Year</a>
                      <a href="#" @click.prevent="setGasUsedChartTimeframe(-1, 'ALL TIME')">All Time</a>
                    </div>
                  </div>
                </div>
              </header>
              <div class="explorer-card-body">
                <div id="Gas-Used-Body"></div>
                <div v-if="loadingGasUsedChart">
                    <loading-message />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '../explorer/service';
import LoadingMessage from './LoadingMessage';

export default {
  name: 'StatsPage',
  components: {
    LoadingMessage,
  },
  data() {
    return {
      loadingTransactionVolumeChart: true,
      selectedTransactionVolumeTimeframe: '336', // hours
      selectedTransactionVolumeTimeframeLabel: '14 Days',

      loadingGasUsedChart: true,
      selectedGasUsedTimeframe: '336', // hours
      selectedGasUsedTimeframeLabel: '14 Days',

    };
  },
  mounted() {
    this.updateChart('Transaction-Volume');
    this.updateChart('Gas-Used');
  },
  watch: {
    selectedTransactionVolumeTimeframe() {
      this.updateChart('Transaction-Volume');
    },
    selectedGasUsedTimeframe() {
      this.updateChart('Gas-Used');
    }
  },
  methods: {
    setTransactionChartTimeframe(time, label) {
      this.selectedTransactionVolumeTimeframe = time.toString();
      this.selectedTransactionVolumeTimeframeLabel = label;
    },
    setGasUsedChartTimeframe(time, label) {
      this.selectedGasUsedTimeframe = time.toString();
      this.selectedGasUsedTimeframeLabel = label;
    },

    updateChart(canvas_id) {

      let getMaxHeight = null;
      let getData = null;

      let selectedTimeFrame = null;

      if (canvas_id == 'Transaction-Volume') {
        this.loadingTransactionVolumeChart = true;
        
        getMaxHeight = service.getMaxBlockHeightTransactionVolume;
        getData = service.getTransactionVolume;

        selectedTimeFrame = this.selectedTransactionVolumeTimeframe;

      } else if (canvas_id == 'Gas-Used'){
        this.loadingGasUsedChart = true;
        
        getMaxHeight = service.getMaxBlockHeightGasUsed;
        getData = service.getGasUsed;

        selectedTimeFrame = this.selectedGasUsedTimeframe;
      }

      // remove canvas element
      let chart_canvas_el_rem = document.getElementById(canvas_id + '-Chart');
      if (chart_canvas_el_rem != null) {
        chart_canvas_el_rem.parentNode.removeChild(chart_canvas_el_rem);
      }

      let min_height = 0;
      let max_height = 0;

      getMaxHeight().then(res => {
        // Get current block height 

        let height = res.data['height']

        console.log(canvas_id)
        console.log(height)

        let block_range = 0;

        if (selectedTimeFrame !== '-1') {
          // selectedTimeFrame is selected by hours,
          // convert to seconds
          // then convert to blocks

          block_range = (parseInt(selectedTimeFrame) * 3600) / 5;
        } else {
          // selected all time
          block_range = height;
        }

        min_height = height - block_range;
        max_height = height;

        return getData(min_height);
      }).then(res => {
        // Get transaction volume

        // stop loading animation
        if (canvas_id == 'Transaction-Volume') {
          this.loadingTransactionVolumeChart = false;
        } else if (canvas_id == 'Gas-Used') {
          this.loadingGasUsedChart = false;
        }

        // add canvas element
        let chart_canvas_el_add = document.createElement("CANVAS");
        chart_canvas_el_add.setAttribute('id', canvas_id + "-Chart");
        document.getElementById(canvas_id + "-Body").appendChild(chart_canvas_el_add);

        let timestamps = res.data;

        let num_bars = 40;
        
        let data = [];
        for (let i = 0; i < num_bars; i ++) {
          data.push(0);
        }

        let labels = [];
        for (let i = 0; i < num_bars; i ++) {
          if (i % 4 == 0) {
            let time_selected = parseInt(selectedTimeFrame);
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
              let AMPM = (h >= 12)? " PM":" AM";

              if (h > 12) h = h - 12;
              if (h < 1) h = h + 12;

              labels.push(h + ':' + m + AMPM);
            } else {
              // date labels
              let m = dateAgo.getMonth();
              let d = dateAgo.getDate();

              // only show year when selected All Time
              let y = (selectedTimeFrame == '-1') ?
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
          let count = 0;
          if (canvas_id == 'Transaction-Volume') {
            count = timestamps[i]['Tx_count'];
          } else if (canvas_id = 'Gas-Used') {
            count = timestamps[i]['Gas_used'];
          }

          let height = timestamps[i]['Block_height'];
          if (height == max_height) {
            continue;
          }

          let index = Math.floor(((height - min_height) / (max_height - min_height)) * data.length);

          data[index] += count;
        }

        console.log(canvas_id);
        console.log(data);
        
        // Render transaction volume
        const ctx = document.getElementById(canvas_id + '-Chart');
        ctx.height = 110;
        const myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            showTooltips: false,
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
                  gridLines: {
                    display:false
                  },
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
                  gridLines: {
                    display:false
                  },
                  scaleLabel: {
                    display: false,
                  },
                  ticks: {
                    max: Math.max(...data),
                    beginAtZero: true,
                    autoSkip: true,
                    maxTicksLimit: 2,
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
