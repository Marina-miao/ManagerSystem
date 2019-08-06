<template lang="pug">
  Card.coursehandle
    Form(ref="form" :model="form" :rules="rules" :label-width="120" style="width: 960")
      Card(title="添加/编辑课程信息" dis-hover :bordered="false")
        Row
          Col(span="12")
            FormItem(label="课程名称*" prop="name" style="width: 450px")
              Input(v-model="form.name")
          Col(span="4")
            Button(type="primary" @click="handleRepeatCheck") 查重
        Row
          Col(span="12")
            FormItem(label="科目*" prop="subject")
              Select(v-model="form.subject" multiple style="width: 330px")
                Option(v-for="(v,k) of dicts.subject" :key="k" :value="v.value") {{ v.label }}

        Row
          Col(span="12")
            FormItem(label="年级区间*" prop="grade")
              Select(v-model="form.grade" multiple style="width: 330px")
                Option(v-for="(v,k) of dicts.grade" :key="k" :value="v.value") {{ v.label }}
        Row
          Col(span="12")
            FormItem(label="类型*" prop="type")
              Select(v-model="form.type" style="width: 330px")
                Option(v-for="(v,k) of courseType" :key="k" :value="v.value") {{ v.label }}
        Row
          Col(span="12")
            FormItem(label="线下课所在校区" prop="tel")
              Input(v-model="form.tel" style="width: 330px")
        Row
          Col(span="12")
            FormItem(label="直播课所在校区" prop="grade")
              Select(v-model="gradeArr" style="width: 330px" multiple=true)
                Option(v-for="(v,k) of dicts.grade" :key="k" :value="v.value") {{ v.label }}
        Row
          Col(span="12")
            FormItem(label="教学类型*" prop="job")
              Select(v-model="form.job" style="width: 330px")
                Option(v-for="(v,k) of searchData" :key="k" :value="v.value") {{ v.label }}
        Row
          Col(span="12")
            FormItem(label="限招人数" prop="money" style="width: 450px")
              Input(v-model="form.money")
        Row
          Col(span="12")
            FormItem(label="开课时间" prop="incampus"  style="width: 450px")
              Input(v-model="form.incampus")
        Row
          Col(span="12")
            FormItem(label="课时数" prop="school" style="width: 450px")
              Input(v-model="form.cardholder")
        Row
          Col(span="12")
            FormItem(label="课次数" prop="profile" style="width: 450px")
              Input(v-model="form.cardholder")

        Row
          Col(span="12")
            FormItem(label="标准价格" prop="cardholder" style="width: 450px")
              Input(v-model="form.cardholder")
        Row
          Col(span="12")
            FormItem(label="最低应缴价格" prop="ccardteltel" style="width: 450px")
              Input(v-model="form.ccardteltel")
        Row
          Col(span="12")
            FormItem(label="课时单价" prop="moneycard" style="width: 450px")
              Input(v-model="form.moneycard")
        Row
          Col(span="12")
            FormItem(label="课程详情" prop="bank" style="width: 850px")
              VueUeditorWrap(v-model='form.profile' :config='config')
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
  name: 'coursehandle',
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
      courseType: ['直播课', '录播课', '线下课'],
      gradeArr: [],
      schoolArr: [],
      rules: {}
    }
  },
  watch: {
    gradeArr: function gA () {
      if (this.form !== null && this.form.grade !== null) {
        return this.form.grade.split(',')
      }
      // return []
      return this.form.grade
    },
    schoolArr: function sA () {
      if (this.form !== null && this.form.school !== null) {
        return this.form.school.split(',')
      }
      return []
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
        console.log(this.dicts)
      })
    },
    fetchEditData () {
      getTeacherDetailById(this.id).then(data => {
        this.form = { ...data }
        // this.form.dic = Number(this.form.dic)
      })
    },
    // getSelectData () {
    //   findDictByCodes().then(data => {
    //     this.searchData = data.sys_docfl
    //   })
    // },q
    handleUpload ({ data }) {
      this.$set(this.form, 'pic', data.url)
      // this.$refs['form'].validateField('pic')
    },
    handleUploadDoc ({ sysCode, data }, fileList) {
      if (sysCode !== 1000) return this.$Message.error('上传失败')
      this.$set(this.form, 'url', fileList.response.data[0].url)
      this.$set(this.form, 'docSize', fileList.response.data[0].docSize)
      this.$set(this.form, 'fileName', fileList.response.data[0].name)
    },
    handleSave () {
      if (gradeArr !== null) {
        var gradeStr = ''
        gradeArr.forEach((v, index) => {
          if (index !== 0) {
            gradeStr += ','
          } else {
            gradeStr += v
          }
        }),
        this.form.grade = gradeStr
      }

      if (schoolArr !== null) {
        var schoolStr = ''
        schoolArr.forEach((v, index) => {
          if (index !== 0) {
            schoolStr += ','
          } else {
            schoolStr += v
          }
        }),
        this.form.school = schoolStr
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
    handleRepeatCheck () {
      checkRepeatTel(this.form.tel).then(data => {
        console.log('查重结果')
        console.log(data)
      })
    }
  }
}
</script>

<style scoped>

</style>
