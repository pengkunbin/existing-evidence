<template>
  <el-table
    :data="list"
    tooltip-effect="dark"
    style="width: 100%"
    :header-cell-style="{ background: '#5893fa', color: '#fff'}"
  >
    <el-table-column
      prop="name"
      label="作品名称"
      align="center"
      show-overflow-tooltip
    />
    <el-table-column
      prop="author"
      label="作者名称"
      align="center"
      show-overflow-tooltip
    />
    <el-table-column
      prop="registeredAt"
      label="登记时间"
      align="center"
      show-overflow-tooltip
    >
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.registeredAt, '{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="status"
      label="登记状态"
      align="center"
    />
    <el-table-column label="查看详情" align="center">
      <!-- eslint-disable-next-line-->
      <template slot-scope="scope">
        <!-- TODO: @click -->
        <el-link type="primary" style="color: #10429a" :underline="false" @click="()=>{}">查看证书</el-link>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <div class="operate-container" @click="handleDownload(scope.row)">
          <img src="../../../assets/xiazai.png" height="14" alt="download" style="cursor: pointer">
          <el-link type="primary" :underline="false" style="margin-left: 5px; color: #10429a">下载</el-link>
        </div>
      </template>
    </el-table-column>
    <template slot="empty">暂无数据</template>
  </el-table>
</template>

<script>
import { getDepositList } from '@/api/deposit'
import { download, parseTime } from '@/utils'

export default {
  name: 'DepositTable',
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getDepositList().then((res) => {
        this.list = res.data.map((value) => ({
          id: value.id,
          name: value.name,
          author: value.author,
          registeredAt: new Date(value.time),
          status: '制证发证',
          content: value.content
        }))
        this.$emit('fetched', this.list.length)
      })
    },
    handleDownload(value) {
      download(value.content, value.name)
    },
    parseTime
  }
}
</script>

<style scoped>
.operate-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
