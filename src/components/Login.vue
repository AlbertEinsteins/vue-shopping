<template>
  <div class="login-container">
    <div class="login-box">

      <!-- 登陆logo 区域 -->
      <div class="avator-box">
        <img src="../assets/logo.png" alt="">
      </div>

      <!-- 登陆表单区域 -->
      <el-form ref="formRef" :model="form" :rules="rules" class="form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input placeholder="username" v-model="form.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input placeholder="password"  v-model="form.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>

        <el-form-item class="form-btn">
          <el-button type="primary" @click="login">Submit</el-button>
          <el-button type="info" @click="resetForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    data() {
      return {
        form: {
          username: 'xxx',
          password: ''
        },
        //验证规则
        rules: {
          username: [{
              required: true,
              message: '请输入登陆名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '长度在3-10个字符之间',
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入登陆密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 15,
              message: '长度在6-15个字符之间',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      resetForm() {
        this.$refs.formRef.resetFields()
        this.form.username = this.form.password = ''
      },
      login() {
        const vm = this
        this.$refs.formRef.validate(async (isValid) => {
            if (!isValid) return;

            //发送ajax请求
            const { data } = await this.$http.post('/login', this.form)
            if (data.meta.status !== 200) {
              return vm.$message({
                message: '登陆失败',
                type: 'error'
              })
            }
            vm.$message({
              message: '登陆成功',
              type: 'success'
            })

            window.sessionStorage.setItem('token', data.data.token)
            this.$router.push("/home")
          }
        )
      }
    }
  }
</script>

<style lang="less" scoped>
  .login-container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -225px;
    margin-top: -150px;
    // background: url(../assets/view.jpg) no-repeat;
  }

  .avator-box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    margin-left: -65px;
    margin-top: -65px;
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .form-btn {
    display: flex;
    justify-content: flex-end;
  }
</style>