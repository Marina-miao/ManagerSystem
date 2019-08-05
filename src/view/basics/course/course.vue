<template lang="pug">
  Card.course
    XTable(ref="_t" action="selectTeachersByCondition" v-model="data"
             :columns="columns" :search="search" :page="page" @on-add="handleAdd"
                @on-edit="handleEdit" @on-reset="handleReset" @on-online="handleOnline"
                    @on-delete="handleDelete" @on-disable="handleDisable")
      div
        Button(type="primary" @click="handleAdd" style="margin: 0 20px 20px 0") 新增课程
        Button(type="primary" @click="handleImport" style="margin: 0 20px 20px 0") 批量导入
        Button(type="primary" @click="handleExport" style="margin: 0 20px 20px 0") 批量导出
        Button(type="primary" @click="handleDown" style="margin: 0 20px 20px 0") 下载模版
</template>
<script>
import { mapState } from 'vuex'
import XTable from '_c/x-table'
//   import { selectTeachersByCondition, stopUseTeacher, startUseTeacher } from '@/api/data'
import { forEach } from '../../../libs/tools'

export default {
  name: 'course',
  components: {
    XTable
  },
  data () {
    return {
      form: {},
      columns: [
        { title: '序号', type: 'index', width: 60, fixed: 'left' },
        { title: '课程名称', key: 'name', width: 120, fixed: 'left' },
        {
          title: '所属校区',
          key: 'tel',
          render: (h, { row: { school } }) => h('span', this.getCampus(school)),
          width: 120
        },
        {
          title: '科目',
          key: '',
          render: (h, { row: { subject } }) => h('span', this.getSubject(subject)),
          width: 120
        },
        {
          title: '年级',
          render: (h, { row: { grade } }) => h('span', this.getGrade(grade)),
          width: 70
        },
        { title: '类型', key: 'incampus', width: 120 },
        {
          title: '教学类型',
          render: (h, { row: { subject } }) =>
            h('span', this.getSubject(subject)),
          width: 70
        },
        { title: '限招人数', width: 100 },
        { title: '已报人数', key: 'senddateFm', width: 100 },
        { title: '开课日期', key: 'senddateFm', width: 120 },
        { title: '课时数', key: 'senddateFm', width: 80 },
        { title: '课次', key: 'senddateFm', width: 80 },
        { title: '标准价格', key: 'senddateFm', width: 100 },
        { title: '最低应缴价格', key: 'senddateFm', width: 120 },
        { title: '添加时间', key: 'senddateFm', width: 120 },
        {
          title: '操作',
          key: 'handle',
          width: 200,
          buttons: [
            { name: 'edit', text: '编辑' },
            {
              name: 'custom',
              render: (h, { row }, vm) => {
                return h(
                  'Button',
                  {
                    props: {
                      type: row.jobswitch === 0 ? 'warning' : 'info',
                      size: 'small'
                    },
                    on: { click: () => vm.$emit('on-online', row) }
                  },
                  row.jobswitch === 0 ? '禁用' : '启用'
                )
              }
            },
            {
              name: 'custom',
              render: (h, { row }, vm) => {
                return h(
                  'Button',
                  {
                    props: {
                      type: row.jobswitch === 0 ? 'warning' : 'info',
                      size: 'small'
                    },
                    on: { click: () => vm.$emit('on-online', row) }
                  },
                  row.jobswitch === 0 ? '上线' : '下线'
                )
              }
            }
          ]
        }
      ],
      modal: {
        visible: false,
        flag: '',
        form: {},
        rules: {
          num: [
            { required: true, message: '此项不能为空' },
            { pattern: /^[0-9]*[1-9][0-9]*$/, message: '只能输入正整数' }
          ],
          name: [{ required: true, message: '此项不能为空', trigger: 'blur' }]
        }
      },
      search: [
        { key: 'draw', visible: false, default: 1 },
        { key: 'name', label: '地区' },
        {
          label: '省',
          key: 'province'
        },
        {
          label: '市',
          key: 'city'
        }
      ],
      villages: []
    }
  },
  methods: {
    getSubject (code) {
      var subject = ''
      var arr = code.split(',')
      // 科目：500=语文,1000=英语,1500=数学,2000=物理,2500=化学,3000=生物,3500=政治,4000=历史,4500=地理,5000=其它
      arr.forEach((v, index) => {
        if (index !== 0) {
          subject += ','
        }
        if (v === '500') {
          subject += '语文'
        } else if (v === '1000') {
          subject += '英语'
        } else if (v === '1500') {
          subject += '数学'
        } else if (v === '2000') {
          subject += '物理'
        } else if (v === '2500') {
          subject += '化学'
        } else if (v === '3000') {
          subject += '生物'
        } else if (v === '3500') {
          subject += '政治'
        } else if (v === '4000') {
          subject += '历史'
        } else if (v === '4500') {
          subject += '地理'
        } else if (v === '5000') {
          subject += '其它'
        }
      })
      return subject
    },
    getCampus (code) {
      var campus = ''
      var arr = code.split(',')
      arr.forEach((v, index) => {
        if (index !== 0) {
          campus += ','
        }
        if (v === '500') {
          campus += '清华'
        } else if (v === '1000') {
          campus += '西直门(原国图)'
        } else if (v === '1500') {
          campus += '公主坟'
        } else if (v === '2000') {
          campus += '东直门'
        } else if (v === '2500') {
          campus += '三元桥'
        } else if (v === '3000') {
          campus += '牡丹园'
        } else if (v === '3500') {
          campus += '怀柔'
        } else if (v === '4000') {
          campus += '朝阳门'
        } else if (v === '4500') {
          campus += '人大'
        } else if (v === '5000') {
          campus += '金源(原世纪城)'
        } else if (v === '5500') {
          campus += '上地'
        } else if (v === '6000') {
          campus += '糖果-世纪城'
        } else if (v === '6500') {
          campus += '门头沟'
        } else if (v === '7000') {
          campus += '高考部'
        } else if (v === '7500') {
          campus += '自主招生'
        } else if (v === '8000') {
          campus += '网络部-幼小组'
        } else if (v === '8500') {
          campus += '网络部-小升初组'
        } else if (v === '9000') {
          campus += '网络部-中高自主招生组'
        } else if (v === '9500') {
          campus += '网络部-中考组'
        }
      })
      return campus
    },
    getGrade (code) {
      var grade = ''
      var arr = code.split(',')
      // 年级：1=一年级,2=二年级,3=三年级,4=四年级,5=五年级,6=六年级,7=七年级,8=八年级,9=九年级,10=其它
      arr.forEach((v, index) => {
        if (index !== 0) {
          grade += ','
        }
        if (v === '1') {
          grade += '一年级'
        } else if (v === '2') {
          grade += '二年级'
        } else if (v === '3') {
          grade += '三年级'
        } else if (v === '4') {
          grade += '四年级'
        } else if (v === '5') {
          grade += '五年级'
        } else if (v === '6') {
          grade += '六年级'
        } else if (v === '7') {
          grade += '七年级'
        } else if (v === '8') {
          grade += '八年级'
        } else if (v === '9') {
          grade += '九年级'
        } else if (v === '10') {
          grade += '其它'
        }
      })
      return grade
    },
    handleDisable ({ id, jobswitch }) {
      if (jobswitch === 0) {
        stopCourse(id).then(() => {
          this.$Message.success(`禁用成功`)
          this.reloadList()
        })
      } else {
        startCourse(id).then(() => {
          this.$Message.success(`启用成功`)
          this.reloadList()
        })
      }
    },
    handleOnline ({ id, jobswitch }) {
      if (jobswitch === 0) {
        stopUseTeacher(id).then(() => {
          this.$Message.success(`禁用成功`)
          this.reloadList()
        })
      }else{
        startUseTeacher(id).then(() => {
          this.$Message.success(`启用成功`)
          this.reloadList()
        })
      }
    },
    handleAdd () {
      console.log('跳转新增界面')
      this.$router.push('/basics/course/coursehandle/add')
    },
    handleEdit ({ row }) {
      console.log('编辑')
      this.$router.push(`/basics/course/coursehandle/` + row.id)
    },
    handleImport(){

    },
    handleExport(){

    }
  }
}
</script>
