<template>
  <div class="app-container background">
    <h4 align="center">取证历史</h4>
    <div class="table-total">共{{ evidenceList.length }}条数据</div>
    <el-table :data="evidenceList" :header-cell-style="{'background-color':'#5893f9','color':'white'}">
      <el-table-column align="center" label="取证地址" prop="addr" />
      <el-table-column align="center" label="取证时间">
        <template slot-scope="{row}">
          {{ row.timestamp| parseTime('{y}-{m}-{d} {h}:{i}') }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注" prop="comment" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div class="operate-container" @click="handleDownload(scope.row)">
            <img src="../../assets/xiazai.png" height="14" alt="download" style="cursor: pointer">
            <el-link type="primary" :underline="false" style="margin-left: 5px; color: #10429a">下载</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getTort } from '@/api/tort'
import { download } from '@/utils'

export default {
  name: 'List',
  data() {
    return {
      evidenceList: []
    }
  },
  created() {
    getTort().then(res => {
      res.data.forEach(v => {
        this.evidenceList.push({
          addr: v.url,
          timestamp: new Date(v.time),
          comment: v.description,
          content: v.content
        })
      })
    })
  },
  methods: {
    handleDownload(row) {
      download(row.content, row.comment + '.png' || 'img.png')
    }
  }
}
</script>

<style scoped>
  .table-total {
    margin: 28px 24px 42px;
    color: #8e8e8e;
    font-weight: 500;
  }
  .background{
    padding: 30px 0;
  }
</style>
