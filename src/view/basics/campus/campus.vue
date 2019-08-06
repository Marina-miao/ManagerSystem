<template lang="pug">
  Card.campus
    XTable(ref="_t" action="wkflList" v-model="data" :columns="columns" :search="search" :page="page" @on-add="handleAdd" @on-edit="handleEdit" @on-reset="handleReset" @on-delete="handleDelete" @on-page-change="handlePageChange")
      div
        Button(type="primary" @click="handleAdd" style="margin: 0 20px 20px 0") 新增
    Modal(v-model="modal.visible" :title="modal.flag === 'add' ? '添加资讯分类' : '修改资讯分类'"  width="960")
      Form(ref="_mf" :model="modal.form" :rules="modal.rules" :label-width="95")
        Card(title="资讯分类" dis-hover :bordered="false")
          Row
            Col(span="11")
              FormItem(label="分类名称" prop="name")
                Input(v-model="modal.form.name")
          Row
            Col(span="11")
              FormItem(label="排序" prop="num")
                Input(v-model="modal.form.num")
      .footer(slot="footer")
        Button(type="text" @click="onModalCancel") 取消
        Button(type="primary" @click="onModalSave") 提交
</template>

<script>
  import { mapState } from 'vuex'
  import XTable from '_c/x-table'
  import { wkflList, dictAddOrUpdate, dictDeleteById, dictSelectById } from '@/api/data'

  export default {
    name: 'campus',
    components: { XTable },
    data () {
      return {
        form: {},
        columns: [
          { title: '名称', key: 'name' },
          { title: '所在省市', key: 'name' },
          { title: '地址', key: 'name' },
          { title: '教室数量', key: 'name' },
          { title: '类型', key: 'name' },
          { title: '容纳学生数', key: 'name' },
          { title: '添加时间', key: 'name' },
          { title: '操作',
            key: 'handle',
            width: 240,
            buttons: [
              'edit',
              'manage',
              'delete'
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
          { key: 'name', label: '地区' },
          {
            label: '省',
            key: 'province',
            // select: lookup.streetCode,
            // default: [14, 15].includes(info.roleids) && (info.roleids === 14 ? info.deptName : info.office),
            // props: { disabled: [14, 15].includes(info.roleids) }
          },
          {
            label: '市',
            key: 'city',
            // select: lookup.sysArea.find(v => v.office === this.office)?.villages || [],
            // default: [15].includes(info.roleids) && info.deptName,
            // props: { disabled: [15].includes(info.roleids) }
          }
        ],
        villages: []
      }
    },
    computed: {
      ...mapState({
        streetCode: state => state.lookup.streetCode,
        sex: state => state.lookup.sys_sex,
        sysArea: state => state.lookup.sysArea
      })
    },
    methods: {
      handleOfficeChange () {
        this.sysArea.forEach(v => {
          if (v.office === this.modal.form.office) {
            this.villages = v.villages
          }
        })
      },
      handleAdd () {
        console.log("跳转")
        this.$router.push('/basics/campus/campushandle/add')
      },
      handleEdit ({ row }) {
        this.$router.push(`/campus/campushandle/` + row.id)
      },
      handleDelete ({ row }) {
        dictDeleteById('sys_zxfl', row.id).then(() => {
          this.$Message.success('删除成功')
          this.onModalCancel()
        })
      },
      onModalSave () {
        this.$refs._mf.validate(valid => {
          if (valid) {
            dictAddOrUpdate({ ...this.modal.form, code: 'sys_zxfl', pid: 1297 }).then(_ => {
              this.$Message.success('操作成功')
              this.onModalCancel()
            })
          }
        })
      },
      onModalCancel () {
        this.modal.form = {}
        this.modal.visible = false
        this.$refs._t.fetchTableData()
      }
    }
  }
</script>
<style scoped>

</style>

