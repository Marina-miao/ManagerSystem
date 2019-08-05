<template lang="pug">
  Card.students
    XTable(ref="_t" action="selectTeachersByCondition" v-model="data" :columns="columns" :search="search" :page="page" @on-add="handleAdd" @on-edit="handleEdit" @on-reset="handleReset" @on-online="handleOnline" @on-delete="handleDelete")
      div
        Button(type="primary" @click="handleAdd" style="margin: 0 20px 20px 0") 新增学生
</template>

<script>
import { mapState } from 'vuex'
import XTable from '_c/x-table'
import { selectTeachersByCondition, stopUseTeacher, startUseTeacher } from '@/api/data'
import { forEach } from '../../../libs/tools'

export default {
  name: 'students',
  components: { XTable },
  data () {
    return {
      form: {},
      columns: [
        { title: '序号', type: 'index', width: 60, fixed: 'left' },
        { title: '学生姓名', key: 'name', width: 120, fixed: 'left' },
        { title: '性别', key: 'tel', width: 120 },
        { title: '手机号', key: 'ndtypenum', width: 120 },
        { title: '数据来源', render: (h, { row: { job } }) => h('span', this.getJob(job)), width: 70 },
        { title: '录入人', key: 'incampus', width: 120 },
        { title: '负责销售', render: (h, { row: { subject } }) => h('span', this.getSubject(subject)), width: 70 },
        { title: '录入时间', render: (h, { row: { school } }) => h('span', this.getCampus(school)), width: 200 },
        { title: '操作',
          key: 'handle',
          width: 240,
          buttons: [
            { name: 'edit', text: '详情' },
            { name: 'detail', text: '聊天记录' }
          ],
          width: 200
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
          // select: lookup.streetCode,
          // default: [14, 15].includes(info.roleids) && (info.roleids === 14 ? info.deptName : info.office),
          // props: { disabled: [14, 15].includes(info.roleids) }
        },
        {
          label: '市',
          key: 'city'
          // select: lookup.sysArea.find(v => v.office === this.office)?.villages || [],
          // default: [15].includes(info.roleids) && info.deptName,
          // props: { disabled: [15].includes(info.roleids) }
        }
      ],
      villages: []
    }
  },
  // computed: {
  // ...mapState({
  //   streetCode: state => state.lookup.streetCode,
  //   sex: state => state.lookup.sys_sex,
  //   sysArea: state => state.lookup.sysArea
  // })
  // },
  methods: {
    getJob (code) {
      var job = ''
      switch (code) {
        case 1:
          job = '兼职'
          break
        case 2:
          job = '全职'
          break
        case -1:
          job = '停用'
          break
        default:
          break
      }
      return job
    },
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
    handleAdd () {
      console.log('跳转')
      this.$router.push('/basics/student/studenthandle/add')
    },
    handleEdit ({ row }) {
      console.log('编辑')
      this.$router.push(`/basics/student/studenthandle/` + row.id)
    },
    handleOnline ({ id, jobswitch }) {
      if (jobswitch === 0) {
        stopUseTeacher(id).then(() => {
          this.$Message.success(`禁用成功`)
          this.reloadList()
        })
      } else {
        startUseTeacher(id).then(() => {
          this.$Message.success(`启用成功`)
          this.reloadList()
        })
      }
    },
    reloadList () {
      this.modal.form = {}
      this.$refs._t.fetchTableData()
    },
    // onModalSave () {
    //   this.$refs._mf.validate(valid => {
    //     if (valid) {
    //       dictAddOrUpdate({ ...this.modal.form, code: 'sys_zxfl', pid: 1297 }).then(_ => {
    //         this.$Message.success('操作成功')
    //         this.onModalCancel()
    //       })
    //     }
    //   })
    // },
    // onModalCancel () {
    //   this.modal.form = {}
    //   this.modal.visible = false
    //   this.$refs._t.fetchTableData()
    // }
    look () {
      alert('')
    }
  }
}
</script>
<style scoped>

</style>
