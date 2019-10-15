<template lang="pug">
  Layout.content
    p(class="formTitle") 1. 报名信息
    Form(:model="formData" label-position="right" :label-width="130" class="cupForm")
      FormItem(label="学生姓名(中文名)：")
        Input(v-model="formData.name")
      FormItem(label="学生姓名(汉语拼音)：")
        Input(v-model="formData.namePinyin")
      FormItem(label="学校：")
        Input(v-model="formData.school")
      FormItem(label="年级：")
        Input(v-model="formData.schoolGrade")
      FormItem(label="班级：")
        Input(v-model="formData.schoolClass")
      FormItem(label="学籍卡号：")
        Input(v-model="formData.studentCard")
      FormItem(label="身份证号：")
        Input(v-model="formData.idCard")
      FormItem(label="联系电话：")
        Input(v-model="formData.phone")
    p(class="formTitle") 2. 缴费信息
    div(class="cupForm")
      p
        span 报名时间：
        span {{formData.createTime}}
      p
        span 报名杯赛：
        span {{formData.activityTitle}}
      p
        span 缴费状态：
        span {{formData.paymentStatus}}
    p(class="btnBottom")
      Button(style="margin-right:20px;" @click="back") 取消
      Button(type="primary" @click="save") 保存
</template>
<script>
import {
  _getCupDetail,
  _updateCup
} from '@/api/data.js'
export default {
  data () {
    return {
      formData: {},
      cupMatchId: ''
    }
  },
  computed: {
  },
  components: {
  },
  mounted () {
    this.cupMatchId = this.$route.params.cupMatchId
    this.getCupDetail()
  },
  methods: {
    back () {
      this.$router.push({ path: `/activity/activity_cupMatch` })
    },
    save () {
      let saveData = this.formData
      delete saveData.createTime
      delete saveData.activityTitle
      delete saveData.paymentStatus
      _updateCup(saveData, this.cupMatchId).then(res => {
        this.$Message.success('编辑成功')
        this.$router.push({ path: `/activity/activity_cupMatch` })
      })
    },
    getCupDetail () {
      _getCupDetail(this.cupMatchId).then(res => {
        this.formData = res
        switch (res.paymentStatus) {
          case 0:
            this.formData.paymentStatus = '未缴费'
            break
          case 1:
            this.formData.paymentStatus = '已缴费'
            break
          case 2:
            this.formData.paymentStatus = '已取消'
            break
          case 3:
            this.formData.paymentStatus = '已关闭'
            break
        }
      })
    }
  }
}
</script>
<style lang="less">
  .content {
    background:#fff;
    padding:18px 18px 30px 30px;
    .formTitle {
      color: #2d8cf0;
      margin-top:10px;
    }
    .cupForm {
      padding: 30px 0px 0px 30px;
      p {
        margin-bottom:20px;
      }
    }
  }

</style>
