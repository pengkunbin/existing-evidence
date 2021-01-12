<template>
  <el-table :data="list" style="width: 100%;min-height:390px;padding: 0 24px 0 24px;">
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
  </el-table>
</template>

<script>
    import { getDepositList } from '@/api/deposit'

export default {
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
          })
      },
  }
}
</script>
