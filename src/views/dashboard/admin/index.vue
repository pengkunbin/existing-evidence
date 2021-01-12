<template>
  <div class="app-container dashboard-editor-container">
    <!--头部-->
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="6" :sm="6" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <img src="../../../assets/other_image/touxiang.png" style="vertical-align: middle;">
          </div>
          <div class="card-panel-description" style="margin-right:60px !important;">
            <div class="card-panel-text">
              <p>奕江科技</p>
              <p>13355558888</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="18" :sm="18" :lg="18" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people" style="margin:0 auto;width:47%;height:100%;">
            <div style="margin:13% 0 0 33%;">
              <img src="../../../assets/other_image/cunzheng_2.png" style="margin:0 12px 4px 0;vertical-align: middle;">
              <span style="font-size:18px;">区块链版权存证</span>
            </div>
          </div>
          <b style="display:inline-block;height:73%;border-left:2px solid #eee;margin:24px;" />
          <div class="card-panel-description" style="width:47%;height:100%;margin:0 auto;padding:16px;">
            <div class="card-panel-text" style="margin:14% 0 0 40%;">
              <h1 style="font-size:60px;color:#10429a;font-weight:400;">{{total}}</h1>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--存正历史列表-->
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" style="padding-right:8px;">
        <div style="background-color:#fff;padding:24px 24px 48px 24px;">
          <img src="../../../assets/other_image/lishi.png" style="margin:0 12px 4px 0;vertical-align: middle;">
          <span style="font-size:18px;">区块链版权存证历史</span>
        </div>
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getDepositList } from '@/api/deposit'
export default {
  name: 'DashboardAdmin',
  data() {
    return {
      list: [],
      total: 0,
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
      });
      this.total = this.list.length;
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 24px;
  background-color: rgb(240, 242, 245);
  position: relative;
  height: calc(100vh - 112px);

  .github-corner {
    position: absolute;
    top: 0px;
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

<style lang="scss" scoped>
  .panel-group {
    //margin-top: 18px;

    .card-panel-col {
      margin-bottom: 24px;
    }

    .card-panel {
      height: 180px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      .card-panel-icon-wrapper {
        float: left;
        margin: 30px 0 0 30px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 40px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width:550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
