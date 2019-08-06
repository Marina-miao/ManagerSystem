<template lang="pug">
  Card.course
    XTable(ref="_t" action="selectTeachersByCondition" v-model="data"
             :columns="columns" :search="search" :page="page" @on-add="handleAdd"
                @on-edit="handleEdit" @on-reset="handleReset" @on-online="handleOnline"
                    @on-delete="handleDelete" @on-disable="handleDisable")
      div
        Button(type="primary" @click="handleExport" style="margin: 0 20px 20px 0") 批量导出
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
        { title: '姓名', key: 'name', width: 120, fixed: 'left' },
        {
          title: '手机号',
          key: 'tel',
          render: (h, { row: { school } }) => h('span', this.getCampus(school)),
          width: 150
        },
        {
          title: '所属校区',
          key: '',
          render: (h, { row: { subject } }) => h('span', this.getSubject(subject)),
          width: 280
        },
        {
          title: '最后打卡时间',
          render: (h, { row: { grade } }) => h('span', this.getGrade(grade)),
          width: 220
        },
        {
          title: '操作',
          key: 'handle',
          width: 190,
          buttons: [
            { name: 'edit', text: '考勤详情' },
            { name: 'custom', text: '请假' }
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
    handleEdit ({ row }) {
      console.log('编辑')
      this.$router.push(`/attendance/student/studetails/` + row.id)
    }
  }
}
</script>
