<template lang="pug">
Layout.layoutBox
    Form.formBox(:model="formData" :label-width="84")
      FormItem(label="平台：" props="")
        CheckboxGroup(v-model="platformGroup" @on-change="platformGroupChange")
          Checkbox(label="剑少五级")
          Checkbox(label="华清园")
      FormItem(label="课程分类：")
          CheckboxGroup(v-model="classifyGroup" @on-change="classifyGroupChange")
            Checkbox(label="学段")
            Select.selectWidth(v-model="period")
                Option(v-for="item in periodList" :value="item.name" :key="item.name")
            span.blueFont(type="text" @click="editPeriod") 编辑分类
            p.lineFeed
            Checkbox(label="项目")
            Select.selectWidth(v-model="period" style="margin-right:30px;")
                Option(v-for="item in periodList" :value="item.name" :key="item.name")
            Select.selectWidth(v-model="period")
                Option(v-for="item in periodList" :value="item.name" :key="item.name")
            span.blueFont(type="text" @click="editProject") 编辑分类
      FormItem(label="课程标题：")
          Input(v-model="formData.name" placeholder="")
      FormItem(label="价格：")
          Input(v-model="formData.price" placeholder="")
      FormItem(label="学段：")
          Input(v-model="formData.stage" placeholder="")
      FormItem(label="课时数：")
          Input(v-model="formData.classHour" placeholder="")
      FormItem(label="封面：")
          Upload(:action="coverAction" accept="image/*" :show-upload-list="false" :on-success="handleUpload")
            img(v-if="formData.coverUrl" :src="formData.coverUrl" style="height: 120px; cursor: pointer")
            Button(v-else type="dashed" style="width: 180px; line-height: 110px")
              Icon(type="ios-cloud-upload" size="30")
      FormItem(label="课程表：")
        span.blueFont(type="text") 添加
      FormItem(label="简介：")
        VueUeditorWrap(v-model="formData.introduce" :config="config")
      FormItem(label="师资介绍：")
        VueUeditorWrap(v-model="formData.introduce" :config="config")
      FormItem(label="已学过人数：")
        Input.inputNum(v-model="formData.sales" placeholder="")
      FormItem.bottom
        Button.backBtn(type="primary") 返回
        Button(type="primary" @tap="save") 发布
    //- 编辑学段弹出框
    Modal(v-model="periodModal" width="360")
      p(slot="header")
        span 编辑学段
      div.rowBox
        Row.rowBottom(v-for="item in periodList")
          Col(span="16") {{item.name}}
          Col(span="8")
            span.blueFont(type="text" @click="addPeriod(item.id)") 编辑
            span.blueFont(type="text" @click="deletePeriod(item.id)") 删除
      div(slot="footer")
        span.addText(@click="addPeriod") 添加分类
        Button(type="text" @click="periodCancel") 取消
        Button(type="primary" @click="periodOk") 确定
    //- 添加学段分类弹出框
    Modal(v-model="addPeriodModal")
      div.inputBox
        span.inputLeft 分类名称：
        Input.inputValue(v-model="periodName" placeholder="")
      div(slot="footer")
        Button(type="text" @click="addPeriodCancel") 取消
        Button(type="primary" @click="addPeriodOk") 确定
    //- 编辑项目弹出框
    Modal(v-model="projectModal")
      p(slot="header")
        span 编辑项目
      div.rowBox
        Row.rowBottom(v-for="item in projectList")
          Col(span="16") {{item.value}}
          Col(span="8")
            span.blueFont(type="text" @click="") 添加子类
            span.blueFont(type="text" @click="") 编辑
            span.blueFont(type="text") 删除
      div(slot="footer")
        span.addText(@click="") 添加分类
        Button(type="text" @click="") 取消
        Button(type="primary" @click="") 确定
</template>

<script>
import {
  _getCourseDetail,
  _getPeriodList,
  _deletePeriod
} from '@/api/data'
import config from '@/config'
import VueUeditorWrap from 'vue-ueditor-wrap'
import UploadVideo from '_c/uploadVideo'
export default {
  name: 'courseDetail',
  data () {
    return {
      config: config.ueditor,
      courseId: 0,
      formData: {},
      coverAction: `${process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro}/upload/image`,
      videoAction: `${process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro}/upload/video`,
      platformGroup: [],
      classifyGroup: [],
      periodList: [],
      projectList: [],
      period: '',
      periodModal: false,
      projectModal: false,
      addPeriodModal: false,
      periodName: ''
    }
  },
  components: {
    UploadVideo,
    VueUeditorWrap
  },
  mounted () {
    // 查询课程详情
    this.courseId = this.$route.params.courseId
    if (this.courseId) {
      this.getDetail()
    }
    // 查询所有学段
    this.getPeriod()
  },
  methods: {
    deletePeriod (periodId) {
      // 删除当前学段
      _deletePeriod({ id: periodId }).then(res => {
        this.$Message.success('删除学段成功')
        this.getPeriod()
      })
    },
    getPeriod () {
      _getPeriodList().then(res => {
        this.periodList = res
      })
    },
    editProject () {
      this.projectModal = true
    },
    addPeriodOk () {},
    addPeriodCancel () {
      this.addPeriodModal = false
    },
    addPeriod (periodId) {
      this.addPeriodModal = true
      if (periodId) {

      } else {

      }
    },
    periodOk () {

    },
    periodCancel () {
      this.periodModal = false
    },
    editPeriod () {
      this.periodModal = true
    },
    getDetail () {
      _getCourseDetail(this.courseId).then(res => {
        this.formData = res
        let courseFrom = this.formData.courseFrom
        if (courseFrom === 1) {
          this.platformGroup.push('剑少五级')
        }
        if (courseFrom === 2) {
          this.platformGroup.push('华清园')
        }
      })
    },
    handleUpload () {
      // console.log(1)
    },
    platformGroupChange (data) {
    },
    classifyGroupChange (data) {},
    save () {

    }
  }
}

</script>
<style lang='less'>
  .layoutBox{
    padding-left:50px;
    padding-top:20px;
    background:#fff;
    .formBox{
      width:70%;
      position: relative;
      .inputNum{
        width:200px;
      }
      .bottom{
        width:100%;
        height:70px;
        background:#fff;
      }
      .backBtn{
        margin-right:40px;
      }
      .selectWidth{
        width:200px;
        margin-right:18px;
      }
      .lineFeed{
        margin-bottom:18px;
      }
    }
    .rowBottom{
      margin-bottom:16px;
    }
    .blueFont{
      color:#2d8cf0;
      font-size:14px;
      cursor: pointer;
      margin-right:18px;
    }
    .addText{
      .blueFont();
      float:left;
    }
    .rowBox{
      padding-top:16px;
    }
    .inputLeft{
      float:left;
      margin-top:6px;
    }
    .inputValue{
      width:80%;
      float: left;
      margin-left:20px;
    }
    .inputBox{
      height:30px;
      margin-top:50px;
      margin-bottom:20px;
    }
  }
</style>
