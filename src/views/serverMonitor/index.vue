<template>
  <div class="dashboard-editor-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <server-component :chart-data="serverData" />
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <line-component :chart-data="historyCpu" />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <line-component :chart-data="historyMemory" />
      </el-col>
    </el-row>
    <panel-group :rabbitinfoobj="rabbitinfoobj" @handleSetLineChartData="handleSetLineChartData" />
  </div>
</template>

<script>
import ServerComponent from './components/ServerComponent'
import LineComponent from './components/LineComponent'
import PanelGroup from './components/PanelGroup'

export default {
  name: 'ServerMonitor',
  components: {
    PanelGroup,
    ServerComponent,
    LineComponent
  },
  data() {
    return {
      serverData: { cpu: 0, memory: { memoryUsed: 0, memoryAva: 0 }, disk: { diskUsed: 0, diskAva: 0 }, time: '' },
      rabbitinfoobj: { connectionNum: 0, channelNum: 0, exchangeNum: 0, queueNum: 0 },
      historyCpu: { xAxisArr: [], dataArr: [], title: '' },
      historyMemory: { xAxisArr: [], dataArr: [], title: '' }
    }
  },
  computed: {
    // 在需要使用服务端推送过来的消息时,在computed方法声明
    message() {
      return this.$store.state.user.messageData
    }
  },
  watch: {
    // 临听computed的message
    message: function(data) {
      // console.log("index="+data)
      const result = JSON.parse(data)
      // if (result.hasOwnProperty('server')) {
      if (Object.prototype.hasOwnProperty.call(result, 'server')) {
        this.serverData = result.server
        this.historyCpu.xAxisArr = this.serverData.historyCpu.map(e => e.time)
        this.historyCpu.dataArr = this.serverData.historyCpu.map(e => e.value)
        this.historyCpu.title = 'CPU最近使用情况'
        this.historyMemory.xAxisArr = this.serverData.historyMemory.map(e => e.time)
        this.historyMemory.dataArr = this.serverData.historyMemory.map(e => e.value)
        this.historyMemory.title = '内存最近使用情况'
      }
      // if (result.hasOwnProperty('rabbit')) {
      if (Object.prototype.hasOwnProperty.call(result, 'rabbit')) {
        this.rabbitinfoobj = result.rabbit
      }
    }
  },
  // Vue生命周期函数，在组件被创建的时候进行执行，
  // 在这里可以执行一些数据初始化的操作
  created() {
    console.log('------初始化WebSocket------')
    // 初始化WebSocket(在使用地方调用)
    // this.$setWs.initWebSocket();
  },
  methods: {
  }
}
</script>

  <style lang="scss" scoped>
    .dashboard-editor-container {
      padding: 32px;
      background-color: rgb(240, 242, 245);
      position: relative;

      .github-corner {
        position: absolute;
        top: 0;
        border: 0;
        right: 0;
      }

      .chart-wrapper {
        background: #fff;
        padding: 16px 16px 0;
        margin-bottom: 32px;
      }
    }

    @media (max-width:1024px) {
      .chart-wrapper {
        padding: 8px;
      }
    }
  </style>
