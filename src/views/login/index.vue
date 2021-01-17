<template>
  <div class="login-container">
    <div class="logo">
      <img src="../../assets/login_image/logo.png" alt="">
    </div>
    <div v-show="showLogin">
      <el-form ref="loginForm" :model="loginForm" :rules="Rules" class="login-form" autocomplete="on" label-position="left">

        <div class="title-container">
          <h3 class="title">账号登录</h3>
        </div>

        <div class="login-content">
          <el-form-item prop="username">
            <span class="svg-container">
              <!--<svg-icon icon-class="user" />-->
              <img src="../../assets/other_image/yonghu.png">
            </span>
            <span>用户名：</span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入手机号"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <!--<svg-icon icon-class="password" />-->
                <img src="../../assets/other_image/mima.png">
              </span>
              <span>密 <b style="display:inline-block;width:6px;" /> 码：</span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="请输入登录密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>

          <el-form-item prop="remember">
            <el-checkbox ref="remember" v-model="remember" />
            <span>记住密码</span>
          </el-form-item>

          <el-form-item>
            <el-button style="width:25%;background-color:#a1a1a1;color:#fff;margin:6px 0 0 15%;" @click="toRegister">注册</el-button>
            <el-button :loading="loading" style="margin:0 0 30px 25%; background-color:#10429a;color:#fff;width:25%;" @click="handleLogin">登录</el-button>
          </el-form-item>

        </div>

      </el-form>
    </div>
    <div v-show="showRegister">
      <el-form ref="registerForm" :model="registerForm" :rules="Rules" class="register-form" autocomplete="on" label-position="left">

        <div class="title-container">
          <h3 class="title">用户注册</h3>
        </div>

        <div class="register-content">
          <el-form-item prop="username">
            <span class="svg-container">
              <!--<svg-icon icon-class="user" />-->
              <img src="../../assets/other_image/yonghu.png">
            </span>
            <el-input
              ref="username"
              v-model="registerForm.username"
              placeholder="请输入手机号"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>
          <el-form-item prop="code" style="width:60%;position:relative;">
            <span class="svg-container">
              <!--<svg-icon icon-class="user" />-->
              <img src="../../assets/other_image/yanzhengma.png">
            </span>
            <el-input
              ref="code"
              v-model="registerForm.code"
              placeholder="请输入验证码"
              name="code"
              type="text"
              tabindex="1"
              autocomplete="on"
              style="width:74%;"
              @blur="checkVerifyCode"
            />
            <span style="display:inline-block;position:absolute;top:0;right:-97px;z-index:1000;width:60%;height:36.56px;border:1px solid #a1a1a1;border-radius:5px;" @click="defaultKaptcha">
              <img :src="code_img" alt="" style="width:100%;height:34.56px;">
            </span>
          </el-form-item>
          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <!--<svg-icon icon-class="password" />-->
                <img src="../../assets/other_image/mima.png">
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="registerForm.password"
                :type="passwordType"
                placeholder="请输入密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>
          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="re_password">
              <span class="svg-container">
                <!--<svg-icon icon-class="password" />-->
                <img src="../../assets/other_image/mima.png">
              </span>
              <el-input
                :key="passwordType"
                ref="re_password"
                v-model="registerForm.re_password"
                :type="passwordType"
                placeholder="请确认密码"
                name="re_password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>

          <el-button :loading="loading" style="margin-bottom:18px; background-color:#10429a;color:#fff;width:100%;" @click="handleRegister">完成</el-button>
          <p style="color:#10429a;margin:0 auto;margin-left:30%;font-size:12px;cursor:pointer;" @click="linkToLogin">已有账号？立即登录</p>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import { register } from '@/api/user'
import { defaultKaptcha, checkVerifyCode } from '@/api/kaptcha'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名必填'))
      } else {
        if (!/^1[34578]\d{9}$/.test(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不少于6位'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (!value) {
        callback('请填写验证码')
      } else {
        callback()
      }
    }
    const validateRePassword = (rule, value, callback) => {
      if (!value) {
        callback('请确认密码')
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        code: '',
        re_password: ''
      },
      Rules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }],
        re_password: [{ required: true, trigger: 'blur', validator: validateRePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      remember: 0,
      showLogin: true,
      showRegister: false,
      re_password: '',
      code: '',
      code_img: '',
      verify_token: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    const username = this.getCookie('username')
    const password = Base64.decode(this.getCookie('password'))
    if (username) {
      this.loginForm.username = username
      this.loginForm.password = password
      this.remember = true
    }
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              if (this.remember) {
                this.setCookie('username', this.loginForm.username)
                const passWord = Base64.encode(this.loginForm.password)
                this.setCookie('password', passWord)
                this.setCookie('remember', this.remember)
              } else {
                this.setCookie('username', '')
                this.setCookie('password', '')
              }
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    toRegister() {
      this.defaultKaptcha()
      this.showLogin = false
      this.showRegister = true
    },
    defaultKaptcha() {
      defaultKaptcha().then(res => {
        this.verify_token = res.headers['verify-token']
        this.code_img = window.URL.createObjectURL(res.data)
      })
    },
    checkVerifyCode() {
      checkVerifyCode(this.registerForm.code, this.verify_token).then(res => {
        if (res.data.status !== 'success') {
          this.$set(this, 'registerForm.code', '')
          alert('验证码不正确，请重新填写！')
          this.defaultKaptcha()
        }
      })
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          if (this.registerForm.re_password !== this.registerForm.password) {
            this.$set(this, 'registerForm.re_password', '')
            this.$message.warning('两次密码不一致，请重新输入！')
            return false
          }
          this.loading = true
          register(this.registerForm).then(res => {
            this.linkToLogin()
            this.$refs['registerForm'].resetFields()
            this.$set(this, 'registerForm.code', '')
            this.$set(this, 'registerForm.re_password', '')
            alert('注册成功，请登录！')
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    linkToLogin() {
      this.showLogin = true
      this.showRegister = false
    },
    // 获取cookie
    getCookie: function(key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + '=')
        if (start !== -1) {
          start = start + key.length + 1
          var end = document.cookie.indexOf(';', start)
          if (end === -1) end = document.cookie.length
          return unescape(document.cookie.substring(start, end))
        }
      }
      return ''
    },
    // 保存cookie
    setCookie: function(cName, value, expiredays) {
      var exdate = new Date()
      exdate.setDate(exdate.getDate() + expiredays)
      document.cookie = cName + '=' + decodeURIComponent(value) +
        ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
    }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .login-content {
      margin: 0 auto;
      width: 320px;
    }
    .login-content .el-input {
      display: inline-block;
      height: 47px;
      width: 65%;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background-color:#fff !important;

      input {
        //background: transparent;
        //border: 0px;
        //-webkit-appearance: none;
        //border-radius: 0px;
        //padding: 12px 5px 12px 15px;
        color: #a1a1a1;
        //height: 47px;
        //caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .login-content .el-checkbox {
      padding: 0 6px 6px 15px;
    }

    .login-content .el-form-item {
      margin-bottom: 10px;
      //border: 1px solid rgba(255, 255, 255, 0.1);
      //background: rgba(0, 0, 0, 0.1);
      //border-radius: 5px;
      //color: #454545;
    }
    .login-content .el-form-item__error{
      top: 86% !important;
      left: 94px !important;
    }

    .register-content {
      margin: 0 auto;
      width: 240px;
    }
    .register-content .el-input {
      display: inline-block;
      width: 80%;
      height:20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background-color:#fff !important;

      input {
        height:20px;
        background: transparent;
        border: 0;
        //-webkit-appearance: none;
        border-radius: 0;
        padding: 0;
        color: #a1a1a1;
        //height: 47px;
        //caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .register-content .el-form-item {
      margin-bottom: 18px;
      border: 1px solid #a1a1a1;
      //background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      //color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#a1a1a1;
  $light_gray:#eee;

  .login-container {
    position:relative;
    min-height: 100%;
    width: 100%;
    background: url('../../assets/login_image/bg_1.png') no-repeat center fixed;
    overflow: hidden;

    .logo>img{
      position:absolute;
      top:48px;
      left:48px;
      z-index:10000;
    }

    .login-form {
      width: 460px;
      max-width: 100%;
      height: 313px;
      padding: 0 35px;
      margin: 0 auto;
      position: fixed;
      top: 28%;
      left: 40%;
      right:0;
      bottom:0;
      z-index:1000;
      background-color: #fff;
      border-radius:4px;
    }
    .login-content .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      margin-right:6px;

      img{
        vertical-align: middle;
      }
    }

    .register-form {
      width: 460px;
      max-width: 100%;
      height: 403px;
      padding: 0 35px;
      margin: 0 auto;
      position: fixed;
      top: 26%;
      left: 40%;
      right:0;
      bottom:0;
      z-index:1000;
      background-color: #fff;
      border-radius:4px;
    }

    .register-content .svg-container {
      padding-left:12px;
      color: $dark_gray;
      //vertical-align: middle;
      width: 36px;
      display: inline-block;
      //margin-right:6px;
      img{
        vertical-align: middle;
      }
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .title-container {
      position: relative;

      .title {
        font-size: 18px;
        color: #333333;
        margin: 36px auto 26px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 26px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
