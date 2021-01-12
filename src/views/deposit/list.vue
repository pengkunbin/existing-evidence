<template>
  <div>
    <div class="app-container history-container">
      <el-tabs v-model="activeTab" stretch class="tab-container" @tab-click="total = 0">
        <el-tab-pane label="存证历史" name="deposit" />
        <el-tab-pane label="公证历史" name="notarization" />
      </el-tabs>

      <div class="table-total">共{{ total }}条数据</div>

      <deposit-table v-if="activeTab === 'deposit'" @fetched="handleFetched" />
      <notarization-table v-else @fetched="handleFetched" />
    </div>

    <div v-if="activeTab === 'deposit'" class="button-container">
      <el-button
        type="primary"
        class="apply-button"
        @click="$router.push({name: 'Evidence'})"
      >
        申请公证
      </el-button>
    </div>
  </div>
</template>

<script>
import DepositTable from '@/views/deposit/components/DepositTable'
import NotarizationTable from '@/views/deposit/components/NotarizationTable'
export default {
  name: 'DepositList',
  components: { NotarizationTable, DepositTable },
  data() {
    return {
      activeTab: 'deposit',
      total: 0
    }
  },
  methods: {
    handleFetched(total) {
      this.total = total
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
