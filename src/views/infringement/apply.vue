<template>
  <div class="app-container background">
    <el-form ref="form" :model="form" :rules="applyRules" label-width="100px" style="width: 400px;margin: 0 auto">
      <el-form-item label="网址" prop="url">
        <el-input v-model="form.url" placeholder="请输入网址" />
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input v-model="form.comment" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="float:right;width: 96px" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { saveTort } from '@/api/tort'

export default {
  name: 'Apply',
  data() {
    return {
      form: {
        url: '',
        comment: ''
      },
      applyRules: {
        url: [
          { required: true, trigger: 'blur', message: '请输入网址' },
          { required: true, trigger: 'blur', pattern: /^((https|http){0,1}(:\/\/){0,1})(www\.)?(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/, message: '请检查网址格式' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const body = {}
          body.url = this.form.url
          body.description = this.form.comment
          body.author = this.$store.getters.username
          saveTort(body).then(res => {
            this.$message.success('申请成功')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }

}
</script>

<style scoped>
  .background{
    padding: 200px 0;
  }
</style>
