<template lang="pug">
Layout.layoutBox
    Form.formBox(:model="formData" :label-width="84")
      FormItem(label="平台：" props="")
        CheckboxGroup(v-model="platformGroup" @on-change="platformGroupChange")
          Checkbox(label="剑少五级")
          Checkbox(label="华清园")
      FormItem(label="课程分类：")
          //- Input(v-model="formData.name" placeholder="")
          //- CheckboxGroup(v-model="platformGroup" @on-change="platformGroupChange")
          //-   Checkbox(label="剑少五级")
          //-   Checkbox(label="华清园")
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
      FormItem(label="简介：")
        VueUeditorWrap(v-model="formData.introduce" :config="config")
      FormItem(label="师资介绍：")
        VueUeditorWrap(v-model="formData.introduce" :config="config")
      FormItem(label="已学过人数：")
        Input.inputNum(v-model="formData.sales" placeholder="")
      FormItem.bottom
        Button.backBtn(type="primary") 返回
        Button(type="primary" @tap="save") 发布
</template>

<script>
import { getCourseDetail } from '@/api/data'
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
      classifyGroup: ['学段', '项目']
    }
  },
  components: {
    UploadVideo,
    VueUeditorWrap
  },
  mounted () {
    this.courseId = this.$route.params.courseId
    if (this.courseId) {
      this.getDetail()
    }
  },
  methods: {
    getDetail () {
      getCourseDetail(this.courseId).then(res => {
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
    }
  }
</style>
