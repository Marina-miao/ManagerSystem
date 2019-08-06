<template lang="pug">
  Card.teacherhandle
    <!--h3(style="height: 40px") 添加/编辑教师信息-->
    Form(ref="form" :model="form" :rules="rules" :label-width="120" style="width: 960")
      Card(title="添加/编辑教师信息" dis-hover :bordered="false")
        Row
          Col(span="12")
            FormItem(label="教师姓名" prop="name" style="width: 450px")
              Input(v-model="form.name")
        Row
          Col(span="12")
            FormItem(label="手机号" prop="tel")
              Input(v-model="form.tel" style="width: 330px")
          Col(span="4")
            Button(type="primary" @click="handleRepeatCheck") 查重
        Row
          Col(span="12")
            FormItem(label="证件类型" prop="ndtype")
              Select(v-model="form.ndtype" style="width: 330px")
                Option(v-for="(v,k) of searchData" :key="k" :value="v.value") {{ v.label }}
        Row
          Col(span="12")
            FormItem(label="证件号" prop="ndtypenum" style="width: 450px")
              Input(v-model="form.ndtypenum")
        Row
          Col(span="12")
            FormItem(label="科目" prop="subject")
              Select(v-model="subjectArr" style="width: 330px" multiple=true)
                Option(v-for="(v,k) of dicts.subject" :key="k" :value="v.value") {{ v.label }}
        Row
          Col(span="12")
            FormItem(label="年级区间" prop="grade")
              Select(v-model="gradeArr" style="width: 330px" multiple=true)
                Option(v-for="(v,k) of dicts.grade" :key="k" :value="v.value") {{ v.label }}
        Row
          Col(span="12")
            FormItem(label="类型" prop="job")
              Select(v-model="form.job" style="width: 330px")
                Option(v-for="(v,k) of jobData" :key="k" :value="v.value") {{ v.label }}
        Row
          Col(span="5")
            FormItem(label="课时费区间" prop="money")
              Input(v-model="minMoney")
          Col(span="2")
            FormItem(label="-" prop="money" label-width="30")
              Input(v-model="maxMoney" style="width: 75px")
        Row
          Col(span="12")
            FormItem(label="在职教师所在学校" prop="incampus"  style="width: 450px")
              Input(v-model="form.incampus")
        Row
          Col(span="12")
            FormItem(label="所在校区" prop="school")
              Select(v-model="schoolArr" style="width: 330px" multiple=true)
                Option(v-for="(v,k) of dicts.school" :key="k" :value="v.value") {{ v.label }}
        Row
          Col(span="20")
            FormItem(label="教师简介" prop="profile")
              VueUeditorWrap(v-model="form.profile" :config="config")
      Card(title="银行卡信息" dis-hover :bordered="false")
        Row
          Col(span="12")
            FormItem(label="持卡人" prop="cardholder" style="width: 450px")
              Input(v-model="form.cardholder")
        Row
          Col(span="12")
            FormItem(label="联系方式" prop="ccardteltel" style="width: 450px")
              Input(v-model="form.ccardteltel")
        Row
          Col(span="12")
            FormItem(label="卡号" prop="moneycard" style="width: 450px")
              Input(v-model="form.moneycard")
        Row
          Col(span="12")
            FormItem(label="开户行" prop="bank" style="width: 450px")
              Input(v-model="form.bank")
        Row
          Col(span="12")
            FormItem(label="持卡人证件类型" prop="cdtype")
              Select(v-model="form.cdtype" style="width: 330px")
                Option(v-for="(v,k) of searchData" :key="k" :value="v.value") {{ v.label }}
        Row
          Col(span="12")
            FormItem(label="证件号" prop="cdtypenum" style="width: 450px")
              Input(v-model="form.cdtypenum")
        Row
          Col(span="12")
            FormItem
              Button(type="primary" style="margin-right: 60px" @click="handleCancel") 取消
              Button(type="primary" @click="handleSave") 保存
</template>

<script>
  import { mapMutations } from 'vuex'
  import config from '@/config'
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import { selectDictsByCodes, getTeacherDetailById, addOrUpdateTeacher, checkRepeatTel } from '@/api/data'
  export default {
    name: 'teacherhandle',
    components: { VueUeditorWrap },
    props: ['id'],
    data () {
      return {
        action: `${process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro}/file/uploadPC`,
        actionUp: `${process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro}/file/uploadFiles`,
        config: config.ueditor,
        dicts: '',
        searchData: '',
        form: {},
        gradeArr: [],
        subjectArr: [],
        schoolArr: [],
        jobData:[
          {
            label:'停用',
            value:-1
          },
          {
            label:'兼职',
            value:1
          },
          {
            label:'全职',
            value:2
          }
        ],
        minMoney:'',
        maxMoney:'',
        rules: {
          // dic: [{ required: true, message: '此项不能为空', trigger: 'blur', type: 'number' }],
          // title: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
          // url: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
          // author: [{ required: true, message: '此项不能为空', trigger: 'blur' }]
        }
      }
    },
    mounted () {
      this.fetchDicts()
      this.id !== 'add' && this.fetchEditData()
    },
    methods: {
      ...mapMutations(['closeTag']),
      fetchDicts () {
        selectDictsByCodes().then(data => {
          this.dicts = data
        })
      },
      fetchEditData () {
        getTeacherDetailById(this.id).then(data => {
          this.form = { ...data }

          if (this.form !== null && this.form.grade !== null) {
            this.gradeArr = this.form.grade.split(",")
          }else{
            this.gradeArr = []
          }

          if (this.form !== null && this.form.subject !== null) {
            this.subjectArr = this.form.subject.split(",")
          }else {
            this.subjectArr = []
          }

          if (this.form !== null && this.form.school !== null) {
            this.schoolArr = this.form.school.split(",")
          }else {
            this.schoolArr = []
          }

          if (this.form !== null && this.form.money !== null) {
            this.minMoney = this.form.money.split('-')[0]
            this.maxMoney = this.form.money.split('-')[1]
          }else {
            this.minMoney = ''
            this.maxMoney = ''
          }
        })
      },
      handleUpload ({ data }) {
        this.$set(this.form, 'pic', data.url)
      },
      handleUploadDoc ({ sysCode, data }, fileList) {
        if (sysCode !== 1000) return this.$Message.error('上传失败')
        this.$set(this.form, 'url', fileList.response.data[0].url)
        this.$set(this.form, 'docSize', fileList.response.data[0].docSize)
        this.$set(this.form, 'fileName', fileList.response.data[0].name)
      },
      handleSave () {
        console.log("年级数据")
        console.log(this.gradeArr)
        if (this.gradeArr !== null) {
          var gradeStr = ""
          this.gradeArr.forEach((v, index) => {
            console.log(v)
            if (index !== 0) {
              gradeStr += ","
            }
            gradeStr += v
          }),
          this.form.grade = gradeStr
        }

        if (this.subjectArr !== null){
          var subjectStr = ""
          this.subjectArr.forEach((v, index) => {
            if (index !== 0) {
              subjectStr += ","
            }
            subjectStr += v
          }),
            this.form.subject = subjectStr
        }

        if (this.schoolArr !== null){
          var schoolStr = ""
          this.schoolArr.forEach((v, index) => {
            if (index !== 0) {
              schoolStr += ","
            }
            schoolStr += v
          }),
          this.form.school = schoolStr
        }

        if (this.minMoney != '' && this.maxMoney != ''){
          this.form.money = this.minMoney + '-' + this.maxMoney
        }

        this.$refs['form'].validate(valid => {
          if (valid) {
            addOrUpdateTeacher(this.form).then(res => {
              this.$Message.success('保存成功')
              this.handleCancel()
            })
          }
        })
      },
      handleCancel () {
        this.closeTag(this.$route)
      },
      handleRepeatCheck() {
        checkRepeatTel(this.form.tel).then(data => {
          console.log("查重结果")
          console.log(data)
        })
      }
    }
  }
</script>

<style scoped>

</style>

