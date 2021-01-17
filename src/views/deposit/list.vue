<template>
  <div>
    <div class="app-container history-container">
      <el-tabs v-model="activeTab" stretch class="tab-container" @tab-click="total = 0">
        <el-tab-pane label="存证历史" name="deposit" />
        <el-tab-pane label="公证历史" name="notarization" />
      </el-tabs>

      <div class="table-total">共{{ total }}条数据</div>
      <deposit-table v-if="activeTab === 'deposit'" @fetched="handleFetched" @currentRow="handleRowChanged" @showImage="handleShowImg" />
      <notarization-table v-else @fetched="handleFetched" />
    </div>
    <el-dialog :visible.sync="drawer" @open="open">
      <canvas ref="canvas" style="margin-left: 100px" width="661" height="964" />
    </el-dialog>
    <div v-if="activeTab === 'deposit'" class="button-container">
      <el-button
        type="primary"
        class="apply-button"
        @click="apply"
      >
        申请公证
      </el-button>
      <!--      <canvas ref="canvas" width="661" height="964" />-->
    </div>
  </div>
</template>

<script>
import DepositTable from '@/views/deposit/components/DepositTable'
import NotarizationTable from '@/views/deposit/components/NotarizationTable'
import { parseTime } from '@/utils'
import { getChainId } from '@/api/deposit'
export default {
  name: 'DepositList',
  components: { NotarizationTable, DepositTable },
  data() {
    return {
      activeTab: 'deposit',
      total: 0,
      selectedRow: undefined,
      drawer: false,
      canvas: undefined
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.drawer = true
      console.log(this.canvas)
      this.drawer = false
    })
  },
  methods: {
    open() {
      if (!this.canvas) {
        this.$nextTick(function() {
          this.canvas = this.$refs.canvas
          console.log(this.canvas)
        })
      }
    },
    handleFetched(total) {
      this.total = total
    },
    handleRowChanged(val) {
      this.selectedRow = val
    },
    apply() {
      if (this.selectedRow) {
        const query = {
          content: this.selectedRow.content,
          description: this.selectedRow.description,
          personorteam: this.selectedRow.personorteam,
          stime: parseTime(this.selectedRow.registeredAt, '{y}-{m}-{d} {h}:{i}:{s}'),
          type: this.selectedRow.type
        }
        console.log('apply')
        console.log(query)
        this.$router.push({ name: 'Evidence', query })
      } else {
        this.$message.warning('请先选择存证')
      }
    },
    async handleShowImg() {
      const chainIdRes = await getChainId()
      this.drawer = true
      const img = new Image()
      const imgUrl = require('@/assets/zhengshu.png')
      img.src = imgUrl
      img.onload = () => {
        const ctx = this.canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const img2 = new Image(100, 100)
        const jrQrcode = require('jr-qrcode')
        const qrCodeUrl = `http://182.92.1.110:5100/#/transaction/transactionDetail?pkHash=${this.selectedRow.tx_hash}`
        img2.src = jrQrcode.getQrBase64(qrCodeUrl, { padding: 5, width: 100, height: 100, correctLevel: 0 })
        img2.onload = () => {
          ctx.drawImage(img2, 234, 505)
          ctx.font = '18px 微软雅黑'
          this.drawText(ctx, this.selectedRow.name, 265, 308)
          this.drawText(ctx, this.selectedRow.author, 265, 338)
          ctx.font = '16px 微软雅黑'
          this.drawText(ctx, this.selectedRow.registeredAt.toLocaleString(), 265, 368)
          this.drawText(ctx, this.selectedRow.block_number, 369, 447)
          ctx.font = '14px 微软雅黑'
          this.drawText(ctx, this.selectedRow.content, 108, 688)
          ctx.font = '11px 微软雅黑'
          this.drawText(ctx, this.selectedRow.block_hash, 100, 478)
          this.drawText(ctx, chainIdRes.data, 108, 210)
        }
      }
    },
    drawText(ctx, text, x, y) {
      ctx.fillStyle = 'rgba(0,0,0,1)'
      ctx.fillText(text, x, y) // 选择位置
    }
  }
}
</script>

<style scoped>
.history-container {
  padding: 35px 0 42px;
}

.tab-container {
  width: 200px; margin: 0 auto;
}

>>>.el-tabs__item {
  font-weight: bold;
}

>>>.el-tabs__nav-wrap::after {
  background-color: transparent;
}

.table-total {
  margin: 28px 24px 42px;
  color: #8e8e8e;
  font-weight: 500;
}

.button-container {
  width: 100px;
  margin: 96px auto 0;
}

.apply-button {
  background-color: #10429a;
  border-color: #10429a;
}
</style>
