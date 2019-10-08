<template lang="pug">
  Layout.content
    Button(@click="add" type="primary" style="width:80px;") 添加课表
    Modal(v-model="modalShow")
      Form(ref="formValidate" :rules="ruleValidate" :model="formData" :label-width="86" style="margin-top:50px;")
        FormItem(label="开班时间：" prop="offerCourseTime")
          DatePicker(type="date" style="width: 200px" v-model="formData.offerCourseTime")
        FormItem(label="上课时间：" prop="studyTime")
          Input(v-model="formData.studyTime")
        FormItem(label="开班地点：" prop="offerCourseAddress")
          Input(v-model="formData.offerCourseAddress")
        FormItem(label="开班人数：" prop="offerCourseNum")
          InputNumber(:min="-1" v-model="formData.offerCourseNum" style="width:403px;")
      div(slot="footer")
        Button(type="text" @click="cancel") 取消
        Button(type="primary" @click="save") 确定
    XTable(:isTableShow="isTableShow" v-model="tableData" :columns="columns" @on-delete="deleteTimetable")
</template>

<script>
import XTable from '_c/x-table'
import dayjs from 'dayjs'
import {
  _addTimetable,
  _getTimetable,
  _deleteTimetable
} from '@/api/data.js'
export default {
  data () {
    return {
      modalShow: false,
      isTableShow: true,
      formData: {
        offerCourseNum: null
      },
      courseId: '',
      isAdd: '', // 默认还没有课表新建课表
      ruleValidate: {
        offerCourseTime: [
          { required: true, type: 'date', message: 'Please select the date', trigger: 'blur' }
        ],
        studyTime: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        offerCourseAddress: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        offerCourseNum: [
          { required: true, type: 'number', message: '不能为空且必须是数字', trigger: 'blur' }
        ]
      },
      tableData: [],
      columns: [
        { title: '开班时间', key: 'offerCourseTime' },
        { title: '上课时间', key: 'studyTime' },
        { title: '开班地点', key: 'offerCourseAddress' },
        { title: '开班人数', key: 'offerCourseNum' },
        {
          title: '操作',
          key: 'handle',
          width: 400,
          buttons: [
            'delete'
          ]
        }
      ],
      dateTime: ''
    }
  },
  components: {
    XTable
  },
  mounted () {
    this.courseId = this.$route.query.courseId
    let isNewtable = this.$route.query.isNewtable
    if (isNewtable === 0) {
      this.columns = this.columns.slice(0, 4)
      this.isTableShow = true
    } else {
      this.isTableShow = false
    }
    this.getTimetable()
  },
  methods: {
    deleteTimetable (params) {
      let id = params.row.id
      _deleteTimetable(this.courseId, id).then(res => {
        this.$Message.success('删除课表成功')
        this.getTimetable()
      })
    },
    // 查询当前课程课表
    getTimetable () {
      _getTimetable(this.courseId).then(res => {
        this.tableData = res
      })
    },
    save () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          this.formData.offerCourseTime = dayjs(this.formData.offerCourseTime).format('YYYY-MM-DD HH:mm:ss')
          // 课表还没有
          _addTimetable(this.formData, this.courseId).then(res => {
            this.$Message.success('添加课表成功')
            this.isTableShow = true
            this.modalShow = false
            this.getTimetable()
          })
        } else {
          this.modalShow = true
          this.$Message.error('请根据规则填写内容')
        }
      })
    },
    cancel () {
      this.modalShow = false
    },
    add () {
      this.modalShow = true
      this.formData = {
        offerCourseNum: null
      }
    }
  }
}
</script>
<style>
</style>
