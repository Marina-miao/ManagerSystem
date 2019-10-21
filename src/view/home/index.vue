<template lang="pug">
  Layout.content
    p(class="homeTitle") 快捷入口
    p(class="addBtnP")
      Button( size="large" icon="ios-people" type="primary" class="addActive" @click="addActive") 新建活动
      Button( size="large" icon="md-bookmarks" type="primary" @click="addCourse") 新建课程
    Modal(v-model="modalShow")
      p(slot="header")
        span 新建课程
      Form(ref="formValidate" :model="formData" :rules="ruleValidate")
        FormItem(label="" prop="courseType")
          RadioGroup(v-model="formData.courseType" @on-change="radioChange")
            Radio(label="面授") 面授
            Radio(label="线上") 线上
      div(slot="footer")
        Button(type="text" @click="cancel") 取消
        Button(type="primary" @click="save") 确定
    p(class="homeTitle") 新增数据
    Card(class="dataCard")
      Row
        Col(class="dataCol")
          Button(@click="goConsult")
            span(class="dataTitle") {{consultNumber}}
            br
            span 未读咨询
        Col(class="dataCol")
          Button(@click="goComment")
            span(class="dataTitle") {{commentNumber}}
            br
            span 新增评论
        Col(class="dataCol")
          Button(@click="goOrder")
            span(class="dataTitle") {{orderNumber}}
            br
            span 本周新增订单
</template>
<script>
import {
  _getConsult,
  _getCommentlist,
  _getOrder
} from '@/api/data.js'
export default {
  data () {
    return {
      modalShow: false,
      formData: {
        courseType: ''
      },
      ruleValidate: {
        courseType: [
          { required: true, message: '必须选择课程类型', trigger: 'change' }
        ]
      },
      radioValue: '',
      consultNumber: '',
      commentNumber: '',
      orderNumber: ''
    }
  },
  computed: {

  },
  components: {
  },
  mounted () {
    this.getConsult()
    this.getComment()
    this.getOrder()
  },
  methods: {
    getOrder () {
      _getOrder().then(res => {
        this.orderNumber = res
      })
    },
    getComment () {
      _getCommentlist({ read: false }).then(res => {
        this.commentNumber = res.total
      })
    },
    getConsult () {
      _getConsult().then(res => {
        this.consultNumber = res
      })
    },
    goConsult () {
      this.$router.push({ path: `/consult/consult_list` })
    },
    goComment () {
      this.$router.push({ path: `/course/course_comment` })
    },
    goOrder () {
      this.$router.push({ path: `/order/order_list` })
    },
    save () {
      if (this.radioValue === '面授') {
        this.$router.push({ path: `/course/course_offlineDetail/add` })
      } else if (this.radioValue === '线上') {
        this.$router.push({ path: `/course/course_onlineDetail/add` })
      }
    },
    cancel () {
      this.modalShow = false
    },
    radioChange (value) {
      this.radioValue = value
    },
    addCourse () {
      this.modalShow = true
    },
    addActive () {
      this.$router.push({ path: `/activity/activity_detail/add` })
    }
  }
}
</script>
<style lang="less">
.content{
    background:#fff;
    padding:10px 18px 30px 40px;
    .homeTitle {
      font-size:20px;
      font-weight: bold;
      margin-top:20px;
    }
    .formItem {
      margin-top:30px;
    }
    .addBtnP {
      margin-top: 20px;
      margin-bottom:20px;
    }
    .addActive {
      margin-right:20px;
    }
    .dataCard {
      width:400px;
      margin-top:20px;
    }
    .dataCol {
      float:left;
      width:33.3%;
      text-align: center;
      Button{
        border:0px;
      }
    }
    .dataTitle{
      font-size:20px;
      font-weight: bold;
    }
  }
</style>
