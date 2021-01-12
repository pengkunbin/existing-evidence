<template>
  <div class="app-container" style="padding-bottom: 24px; overflow-x: auto">
    <h3 class="head"> 作品文件上传 </h3>
    <div v-for="(item, index) in works" :key="index" class="form-container body-container work">
      <div class="work__inner_side emphasis" style="width: 152px">作品{{ indexMap[index] }}</div>
      <div class="work__inner_form">
        <el-form
          :ref="`workForm${index}`"
          :model="works[index]"
          :rules="workRules"
          label-width="80"
          :disabled="works[index].status === 1"
        >
          <el-form-item label="作品名称:" prop="name">
            <el-input v-model="item.name" style="width: 330px" />
          </el-form-item>
          <el-form-item label="作品种类:" prop="type">
            <el-select
              v-model="item.type"
              style="width: 330px"
              placeholder="请选择"
              :disabled="typeof works[index].file !== 'undefined'"
            >
              <el-option
                v-for="(opt, idx) in workTypeOptions"
                :key="idx"
                :label="opt"
                :value="idx"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="作品描述:" prop="description">
            <el-input v-model="item.description" type="textarea" style="width: 400px" :rows="3" />
          </el-form-item>
          <el-form-item prop="file">
            <el-upload
              drag
              :limit="1"
              :accept="uploadAccept(index)"
              :auto-upload="false"
              :action="uploadAction"
              :on-exceed="() => handleUploadExceed(index)"
              :on-change="(file, fileList) => handleFileChange(index, file, fileList)"
              :on-remove="(file, fileList) => handleFileRemove(index, file, fileList)"
              :file-list="uploadList[index]"
            >
              <img src="../../assets/shangchuan.png" style="margin-top: 24px" alt="upload">
              <div class="el-upload__text">拖动上传或打开文件上传</div>
              <div slot="tip" class="el-upload__tip upload-tip" v-text="uploadTip" />
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="item.status !== 0" class="work__inner_side status" :class="item.status === 1?'success':'fail'">
        {{ item.status === 1 ? '提交成功': '提交失败' }}
      </div>
      <div v-if="works.length > 1" class="close-button">
        <i class="el-icon-close" @click="handleWorkRemove(index)" />
      </div>
    </div>

    <div v-if="works.length < 6" class="add-container body-container" @click="handleAddWork">
      <img src="../../assets/tianjia.png" alt="add">
      <span class="add-button-text">添加新作品</span>
    </div>

    <h3 class="head"> 作品基本信息 </h3>
    <div class="form-container body-container info">
      <el-form ref="infoForm" :model="info" :rules="infoRules" label-width="80" style="width: 400px; margin: 0 auto">
        <el-form-item label="权利归属" prop="ownerShip">
          <el-radio-group v-model="info.ownerShip">
            <el-radio :label="0">个人作品</el-radio>
            <el-radio :label="1">合作作品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="作者名称" prop="author">
          <el-input v-model="info.author" style="width: 330px" />
        </el-form-item>
      </el-form>
    </div>

    <div class="body-container footer">
      <el-button type="info" class="footer-btn cancel-btn" @click="$router.go(-1)">取 消</el-button>
      <el-button type="primary" class="footer-btn submit-btn" @click="handleSubmit">提 交</el-button>
    </div>

    <el-dialog
      :visible.sync="submitting"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="submitting-text">提交中，请勿刷新页面…</div>
    </el-dialog>
  </div>
</template>

<script>
import { createDepositItem } from '@/api/deposit'

const defaultWork = {
  name: '',
  type: undefined, // number or undefined
  description: '',
  file: undefined, // object or undefined
  status: 0 // 0: not submitted, 1: submitted successfully, 2: failed
}
const defaultWorkInfo = {
  ownerShip: undefined, // number or undefined
  author: ''
}

export default {
  name: 'DepositApplication',
  data() {
    return {
      works: [Object.assign({}, defaultWork)],
      info: Object.assign({}, defaultWorkInfo),

      workRules: {
        name: [{ required: true, message: '请输入作品名称', trigger: 'change' }],
        type: [{ required: true, message: '请选择作品类型', trigger: 'change' }],
        file: [{ required: true, message: '请上传作品文件', trigger: 'change' }]
      },
      infoRules: {
        ownerShip: [{ required: true, message: '请选择权利归属', trigger: 'change' }],
        author: [{ required: true, message: '请输入作者名称', trigger: 'change' }]
      },

      workTypeOptions: ['文档', '图片', '音频', '视频'],
      indexMap: ['一', '二', '三', '四', '五', '六'],
      uploadTip: '说明:\n' +
        '1.上传单个文件大小不超过100M\n' +
        '2.文件格式必须符合条件，支持上传格式: txt、md、doc、docx、pdf、png、jpg、jpeg、mp3、mp4、avi\n',
      uploadAction: '',
      fileAccepts: [
        ['.txt', '.md', '.doc', '.docx', '.pdf'],
        ['.png', '.jpg', '.jpeg'],
        ['.mp3'],
        ['.mp4', '.avi']
      ],
      uploadList: [[]], // prevent next file list from disappearing after deleting previous work
      submitting: false
    }
  },
  methods: {
    uploadAccept(index) {
      if (typeof this.works[index].type !== 'undefined') {
        return this.fileAccepts[this.works[index].type].join(',')
      }
      return this.fileAccepts.join(',')
    },
    handleUploadExceed(index) {
      this.$notify.error({
        title: '上传数超出上限',
        message: `请删除作品${this.indexMap[index]}已上传的文件后重试，或添加新作品`
      })
    },
    validateFile(index, file) {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      let type
      if (typeof this.works[index].type === 'undefined') {
        // no type selected, check all
        for (let i = 0; i < this.fileAccepts.length; i++) {
          if (this.fileAccepts[i].indexOf(ext) !== -1) {
            type = i
            break
          }
        }
      } else if (this.fileAccepts[this.works[index].type].indexOf(ext) !== -1) {
        // selected type and passed check
        type = this.works[index].type
      }
      if (typeof type === 'undefined') {
        this.$notify.error({
          title: `不支持的${this.works[index].type ? this.workTypeOptions[this.works[index].type] : '文件'}类型`,
          message: `请检查作品${this.indexMap[index]}上传文件类型`
        })
        return false
      }
      if (file.size / 1024 / 1024 > 100) {
        this.$notify.error({
          title: '文件大小超出上限',
          message: `作品${this.indexMap[index]}上传大小超出上限`
        })
        return false
      }
      if (!this.clearWorkFormValidate(index, 'file')) return false
      this.works[index].type = type
      return true
    },
    handleFileChange(index, file, fileList) {
      if (!this.validateFile(index, file)) return
      this.works[index].file = file
      this.uploadList[index] = fileList // avoid style thrashing
    },
    handleFileRemove(index, file, fileList) {
      this.uploadList[index] = fileList
      this.works[index].file = undefined
    },
    handleWorkRemove(index) {
      this.works.splice(index, 1)
      this.uploadList.splice(index, 1)
      if (index !== 1) this.clearWorkFormValidate(index, 'file')
    },
    handleAddWork() {
      if (this.works.length < 6) {
        this.uploadList.push([])
        this.works.push(Object.assign({}, defaultWork))
      }
    },
    handleSubmit() {
      const promises = []
      const toSubmit = []
      this.works.forEach((value, index) => {
        if (value.status === 1) return
        const workForm = this.$refs[`workForm${index}`]
        if (!workForm || !workForm[0]) return
        promises.push(workForm[0].validate())
        toSubmit.push(value)
      })
      if (toSubmit.length === 0) { this.triggerSuccess(); return }
      const infoForm = this.$refs['infoForm']
      if (!infoForm) return
      promises.push(infoForm.validate())
      Promise.all(promises).then(() => {
        this.submit(toSubmit)
      }).catch()
    },
    submit(toSubmit) {
      const promises = []
      let hasFailed = false
      this.submitting = true
      toSubmit.forEach((value) => {
        const view = {
          author: this.info.author,
          description: value.description,
          file: value.file.raw,
          name: value.name,
          personorteam: this.info.ownerShip.toString(),
          type: value.type.toString()
        }
        const formData = new FormData()
        for (const k in view) {
          // eslint-disable-next-line no-prototype-builtins
          if (view.hasOwnProperty(k)) formData.append(k, view[k])
        }
        promises.push(createDepositItem(formData)
          .then(() => { value.status = 1 })
          .catch(() => { value.status = 2; hasFailed = true })
        )
      })
      Promise.allSettled(promises)
        .then(() => {
          setTimeout(() => {
            this.submitting = false
            if (!hasFailed) this.triggerSuccess()
            else {
              this.$notify.error({
                title: '错误',
                message: '存在提交失败的作品'
              })
            }
          }, 2000)
        })
    },
    triggerSuccess() {
      this.$notify.success({
        title: '成功',
        message: '全部作品已成功提交'
      })
      this.$router.push({ name: 'DepositList' })
    },
    clearWorkFormValidate(index, field) {
      // return false if node not found
      const workForm = this.$refs[`workForm${index}`]
      if (!workForm || !workForm[0]) return false
      if (field) workForm[0].clearValidate(field)
      else workForm[0].clearValidate()
      return true
    }
  }
}
</script>

<style scoped>
.head {
  padding-top: 48px;
  margin: 0 auto;
  width: 800px;
  font-size: 22px;
  font-weight: 400;
}

.emphasis {
  font-weight: 400;
  font-size: 1.2em;
}

.body-container {
  margin: 24px auto;
  width: 800px;
}

.form-container {
  border: 1px solid #9ea8b1;
  border-radius: 5px;
}

.work {
  position: relative;
  padding: 24px 0 24px 48px;
}

.work__inner_side {
  display: inline-block;
  vertical-align: top;
  margin-top: 240px;
}

.work__inner_form {
  display: inline-block;
  width: 450px;
}

.status {
  font-size: 0.8em;
}

.success {
  color: #67C23A;
}

.fail {
  color: #F56C6C;
}

.info {
  padding: 24px 0;
}

::v-deep.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before, .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap > .el-form-item__label:before {
  margin-left: -10px;
}

::v-deep .el-upload-dragger{
  width: 400px;
  height: 120px;
  border: 1px solid #DCDFE6;
}

.upload-tip {
  white-space: pre-wrap;
  width: 420px;
  line-height: 20px;
}

::v-deep .el-upload-list{
  width: 400px;
}

.close-button {
  position: absolute; top: 12px; right:12px; font-size: 24px; color: #5c5e62; cursor: pointer;
}

.add-container {
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}

.add-button-text {
  margin-left: 24px; color: gray; font-weight: 500;
}

.footer {
  display: flex; align-items: center; justify-content: center;
}

.footer-btn {
  width: 120px; height: 40px;
}

.cancel-btn {
  margin-right: 48px;
}

.submit-btn {
  margin-left: 48px;
  background-color: #10429a;
  border-color: #10429a;
}

::v-deep .el-dialog{
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%,-50%);
  max-height: calc(100% - 30px);
  max-width: 500px;
}

::v-deep .el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}

.submitting-text {
  width: 100%;
  line-height: 100px;
  text-align: center;
}
</style>
