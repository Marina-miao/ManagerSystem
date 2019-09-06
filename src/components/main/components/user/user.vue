<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Button type="text">{{ username }}</Button>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="changePassword">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal v-model="visible" title="修改密码" :transfer="true">
      <XForm ref="_mf" v-model="form" :rules="rules" :schema="schema"></XForm>
      <template slot="footer">
        <Button @click="onModalCancel">关闭</Button>
        <Button type="primary" @click="onModalSave">保存</Button>
      </template>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import XForm from '_c/x-form'
import Validator from '@/libs/validator'
import { changePassword } from '@/api/user'

export default {
  name: 'User',
  components: { XForm },
  props: {
    username: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: false,
      form: {},
      rules: {
        oldPWD: [Validator.isRequired()],
        newPWD: [Validator.isRequired()]
      },
      schema: [
        {
          row: [{ key: 'oldPWD', label: '旧密码' }]
        },
        {
          row: [{ key: 'newPWD', label: '新密码' }]
        }
      ]
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    handleClick (name) {
      switch (name) {
        case 'changePassword':
          this.visible = true
          break
        case 'logout':
          this.handleLogOut()
          break
      }
    },
    onModalSave () {
      this.$refs._mf.validate(valid => {
        if (valid) {
          changePassword(this.form).then(() => {
            this.$Message.success('密码修改成功，请用新密码重新登录！')
            this.handleLogOut()
          }, err => this.onModalCancel())
        }

        this.onModalCancel()
      })
    },
    onModalCancel () {
      this.visible = false
      this.form = {}
    }
  }
}
</script>
