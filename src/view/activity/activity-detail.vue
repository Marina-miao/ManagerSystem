<template lang="pug">
  Layout.content
    Form.formBox(ref="formInline" :model="formData" :rules="ruleValidate" :label-width="120")
      FormItem(label="平台：" prop="platformGroup")
        CheckboxGroup(v-model="formData.platformGroup" @on-change="platChange")
          Checkbox(label="剑少五级")
          Checkbox(label="华清园")
      FormItem(label="活动类型：" prop="type" class="formItem" )
        RadioGroup(v-model="formData.type" @on-change="radioChange")
          Radio(label="普通活动") 普通活动
          Radio(label="杯赛" :disabled="isDisabled") 杯赛
      FormItem(label="活动场次：")
        Button(type="primary" @click="addScene") 添加
        Card(v-if="sceneData.length != 0" style="width: 400px;margin-top:20px;")
          p(slot="title" class="cardTitle") 活动场次
          p(v-for="(item, index) in sceneData")
            span {{item.value}}
            Button(type="primary" size="small" style="float:right" @click="deleteScene(index)") 删除
            Button(type="primary" size="small" style="float:right;margin-right:10px;" @click="editScene(index)") 编辑
      FormItem(label="是否推荐到首页：" prop="pushFlag" class="formItem")
        RadioGroup(v-model="formData.pushFlag")
          Radio(label="否") 否
          Radio(label="是") 是
      FormItem(label="活动标题：" prop="title" class="formItem")
          Input(v-model="formData.title" placeholder="" class="inputWidth")
      FormItem(label="适合学段：" prop="studyStage" class="formItem")
          Input(v-model="formData.studyStage" placeholder="" class="inputWidth")
      FormItem(label="封面：" prop="url" class="formItem")
          Upload(:action="coverAction" accept="image/*" :show-upload-list="false" :on-success="handleUpload")
            img(v-if="formData.url " :src="formData.url " style="height: 120px; cursor: pointer")
            Button(v-else type="dashed" style="width: 180px; line-height: 110px")
              Icon(type="ios-cloud-upload" size="30")
      FormItem(label="活动时间段：" prop="startTime" class="formItem")
        DatePicker(type="datetime" v-model="formData.startTime" placeholder="开始时间" class="startTime")
        DatePicker(type="datetime" v-model="formData.endTime" placeholder="结束时间")
      FormItem(label="正文：" prop="mainBody" class="formItem")
        VueUeditorWrap(v-model="formData.mainBody" :config="config")
      FormItem(label="发布时间：" prop="publishTime" class="formItem")
        DatePicker(type="datetime" v-model="formData.publishTime" placeholder="请选择时间")
      FormItem(label="报名费：" v-if="readNumShow" prop="entryfee" class="formItem" :min="0")
          InputNumber.inputNum(v-model="formData.entryfee" placeholder="" :min="0")
      FormItem( label="阅读量：" prop="readNum" class="formItem" :min="0")
          InputNumber.inputNum(v-model="formData.readNum" placeholder="" :min="0")
    Modal(v-model="sceneModal")
      p(style="margin-top:30px;margin-bottom:15px;") 活动场次：
      p
        Input(v-model="sceneInput")
      div(slot="footer")
        Button(type="text" @click="cancel") 取消
        Button(type="primary" @click="saveScene") 确定
    p(class="btnBottom")
      Button(style="margin-right:20px;" @click="back") 取消
      Button(type="primary" @click="save") 保存
</template>
<script>
import {
  _saveActive,
  _getActiveDetail,
  _updateActive
} from '@/api/data.js'
import dayjs from 'dayjs'
import config from '@/config'
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  data () {
    return {
      config: config.ueditor,
      isDisabled: false,
      sceneModal: false,
      sceneInput: '',
      sceneIndex: '',
      activityId: '',
      readNumShow: false,
      sceneData: [],
      coverAction: `${process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro}/upload/images`,
      formData: {
        platformGroup: [],
        readNum: null,
        price: null
      },
      ruleValidate: {
        platformGroup: [
          { required: true, type: 'array', min: 1, message: '必须至少选择一个平台', trigger: 'change' },
          { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择活动类型', trigger: 'change' }
        ],
        pushFlag: [
          { required: true, message: '请选择是否推荐到首页', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        studyStage: [
          { required: true, message: '请输入学段', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请上传封面', trigger: 'blur' }
        ],
        startTime: [
          { type: 'date', required: true, message: '开始时间必填', trigger: 'blur' }
        ],
        mainBody: [
          { required: true, message: '请填写正文', trigger: 'blur' }
        ],
        publishTime: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'blur' }
        ],
        readNum: [
          { required: true, type: 'number', message: '请输入阅读量且为数字', trigger: 'blur' }
        ],
        price: [
          { required: true, type: 'number', message: '请输入阅读量且为数字', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

  },
  components: {
    VueUeditorWrap
  },
  mounted () {
    this.activityId = this.$route.params.activityId
    if (this.activityId !== 'add') {
      this.getActiveDetail()
    }
  },
  methods: {
    radioChange (value) {
      if (value === '杯赛') {
        this.readNumShow = true
      } else {
        this.readNumShow = false
      }
    },
    getActiveDetail () {
      _getActiveDetail(this.activityId).then(res => {
        this.formData = res
        // 平台赋值
        if (res.platform === 2) {
          this.formData.platformGroup = ['剑少五级']
        } else if (res.platform === 1) {
          this.formData.platformGroup = ['华清园']
        } else {
          this.formData.platformGroup = ['华清园 剑少']
        }
        // 活动类型赋值
        if (res.type === 0) {
          this.formData.type = '普通活动'
        } else {
          this.formData.type = '杯赛'
        }
        // 是否推荐赋值
        if (res.pushFlag === 0) {
          this.formData.pushFlag = '否'
        } else {
          this.formData.pushFlag = '是'
        }
        // 活动场次赋值
        this.sceneData = JSON.parse(res.venue)
      })
    },
    uuid () {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'

      var uuid = s.join('')
      return uuid
    },
    back () {
      this.$router.push({ path: `/activity/activity_list` })
    },
    save () {
      this.$refs['formInline'].validate((valid) => {
        // 结束时间不能小于开始时间
        let startTime = this.formData.startTime.getTime()
        let endTime = this.formData.endTime.getTime()
        if (endTime <= startTime) {
          this.$Message.error('结束时间不能晚于开始时间')
          return
        }
        if (valid) {
          let platform = ''
          if (this.formData.platformGroup.toString() === '剑少五级') {
            platform = 2
          } else if (this.formData.platformGroup.toString() === '华清园') {
            platform = 1
          }
          let type = ''
          if (this.formData.radioType === '普通活动') {
            type = 0
          } else {
            type = 1
          }
          let venue = JSON.stringify(this.sceneData)
          let pushFlag = this.formData['pushFlag'] === '否' ? 0 : 1
          let title = this.formData['title']
          let studyStage = this.formData['studyStage']
          let url = this.formData['url']
          let startTime = dayjs(this.formData['startTime']).format('YYYY-MM-DD HH:mm:ss')
          let endTime = this.formData['endTime'] ? dayjs(this.formData['endTime']).format('YYYY-MM-DD HH:mm:ss') : ''
          let mainBody = this.formData['mainBody']
          let publishTime = dayjs(this.formData['publishTime']).format('YYYY-MM-DD HH:mm:ss')
          let readNum = this.formData['readNum']
          let price = this.formData['price']
          let saveData = { platform, type, venue, pushFlag, title, studyStage, url, startTime, endTime, mainBody, publishTime, price, readNum }
          if (this.activityId === 'add') {
            // 保存活动
            _saveActive(saveData).then(res => {
              this.$Message.success('新建活动成功')
              this.$router.push({ path: `/activity/activity_list` })
            })
          } else {
            // 更新活动
            _updateActive(saveData, this.activityId).then(res => {
              this.$Message.success('编辑活动成功')
              this.$router.push({ path: `/activity/activity_list` })
            })
          }
        } else {
          // this.$Message.error('')
        }
      })
    },
    handleUpload (res) {
      this.$set(this.formData, 'url', res.data.fileUrl)
    },
    deleteScene (index) {
      this.sceneData.splice(index, 1)
    },
    editScene (index) {
      this.sceneModal = true
      this.sceneIndex = index
      this.sceneInput = this.sceneData[index].value
    },
    saveScene () {
      if (this.sceneIndex === '') {
        let sceneId = this.uuid()
        this.sceneData.push({ id: sceneId, value: this.sceneInput })
      } else {
        this.$set(this.sceneData[this.sceneIndex], 'value', this.sceneInput)
      }
      this.sceneModal = false
    },
    cancel () {
      this.sceneModal = false
    },
    addScene () {
      this.sceneInput = ''
      this.sceneIndex = ''
      this.sceneModal = true
    },
    platChange () {
      if (this.formData.platformGroup.indexOf('剑少五级') !== -1) {
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
    }
  }
}
</script>
<style lang="less">
  .content {
    background:#fff;
    padding:18px 18px 30px 18px;
    .formItem{
      margin-top:30px;
    }
    .inputWidth {
      width: 400px;
    }
    .startTime {
      margin-right:20px;
    }
    .btnBottom{
      padding-left:30px;
      margin-top:40px;
    }
    .inputNum{
      width: 300px;
    }

  }
</style>
