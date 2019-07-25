<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
            <FormItem prop="name">
              <Input v-model="form.account" placeholder="请输入账号">
                <span slot="prepend">
                  <Icon :size="16" type="ios-person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
                <span slot="prepend">
                  <Icon :size="14" type="md-lock"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" :loading="loading" :icon="!loading ? '' : 'ios-loading'"
                      long>{{!loading ? '登录' : '登录中'}}
              </Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { login } from '@/api/user'

export default {
  data() {
    return {
      form: {
        account: 'super',
        password: '12345678',
      },
      rules: {
        account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
      },
      loading: false,
    }
  },
  methods: {
    ...mapMutations(['setToken']),
    handleSubmit() {
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          this.loading = true
          login(this.form).then(({ token }) => {
            this.setToken(token)
            this.$router.replace('home')
          }).catch(_ => this.loading = false)
        } else {
          this.loading = false
        }
      })
    },
  },
}
</script>
