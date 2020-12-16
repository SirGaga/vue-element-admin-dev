<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/views/dashboard/admin/components/mixins/resize'

export default {
  name: 'LineComponent',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '250px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      default: function() {
        return { xAxisArr: [], dataArr: [], title: '' }
      },
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ xAxisArr, dataArr, title } = {}) {
      this.chart.setOption({
        visualMap: [{
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: 0,
          max: 400
        }],
        title: [{
          left: 'center',
          width: '100%',
          text: title
        }],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [{
          axisLabel: { rotate: 30 },
          data: xAxisArr
        }],
        yAxis: [{
          splitLine: { show: false }
        }],
        grid: [{
          bottom: '15%'
        }, {
          top: '15%'
        }],
        series: [{
          type: 'line',
          showSymbol: true,
          data: dataArr
        }]
      })
    }
  }
}
</script>
