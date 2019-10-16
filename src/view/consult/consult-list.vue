<template lang="pug">
  Layout.content
    XTable(ref="table"
    :isTableShow="isTableShow"
    v-model="tableData"
    :columns="columns"
    :search="search"
    :page="page"
    @on-search="handleSearch"
    @on-singleRead="singleRead"
    @on-selection-change="selectChange"
    @on-delete="deleteConsult")
      Button(type="primary" style="margin-left:10px;" slot="footer" @click="multipleRead") 批量标记为已读
      Button(type="primary" style="margin-left:10px;" slot="footer") 导出当前列表
</template>
<script>
import XTable from '_c/x-table'
import {
  _getConsultList,
  _singleRead,
  _multipleRead,
  _deleteConsult
} from '@/api/data.js'
export default {
  data () {
    return {
      isTableShow: true, // 表格显示隐藏
      formData: {},
      columns: [
        { type: 'selection', width: 60, align: 'center' },
        { title: '序号', type: 'index', width: 80 },
        { title: '平台', key: 'platform', width: 220 },
        { title: '咨询内容', key: 'content' },
        { title: '时间', key: 'createTime', width: 180 },
        { title: '用户', key: 'name' },
        { title: '电话', key: 'mobile', width: 150 },
        { title: '学校', key: 'school' },
        { title: '学段', key: 'studyStage' },
        { title: '状态', key: 'status', width: 100 },
        {
          title: '操作',
          key: 'handle',
          width: 300,
          buttons: [
            {
              name: 'singleRead',
              render: (h, { row }, vm) => {
                return h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => vm.$emit('on-singleRead', row)
                  }
                }, '标记已读')
              }
            },
            'delete'
          ]
        }
      ],
      tableData: [],
      page: {
        current: 1,
        total: 0,
        'page-size': 10
      },
      selections: []
    }
  },
  computed: {
    search () {
      return [
        {
          key: 'nick',
          label: '用户昵称：'
        },
        {
          key: 'platform',
          label: '平台：',
          select: [
            {
              value: 2,
              label: '剑少五级'
            },
            {
              value: 1,
              label: '华清园'
            }
          ]
        },
        {
          key: 'time',
          label: '时间：',
          type: 'date'
        }
      ]
    }
  },
  components: {
    XTable
  },
  mounted () {
    this.getConsultList()
  },
  methods: {
    deleteConsult (params) {
      let id = params.row.id
      _deleteConsult(id).then(res => {
        this.$Message.success('删除成功')
        this.getConsultList()
      })
    },
    selectChange (selections) {
      this.selections = selections
    },
    multipleRead () {
      // console.log(this.selections)
      let markReadIds = []
      this.selections.forEach(item => {
        markReadIds.push(item.id)
      })
      let data = { ids: markReadIds }
      _multipleRead(data).then(res => {
        this.$Message.success('批量标记已读成功')
        this.getConsultList()
      })
    },
    singleRead (row) {
      let id = row.id
      _singleRead(id).then(res => {
        this.$Message.success('已读成功')
        this.getConsultList()
      })
    },
    getConsultList () {
      _getConsultList({ ...this.formData, pageNum: (this.page.current - 1) * this.page['page-size'], pageSize: this.page['page-size'] }).then(res => {
        this.page['total'] = res.total
        this.tableData = res.data.map(item => {
          return {
            id: item.id,
            platform: item.platform === 2 ? '剑桥五级' : '华清园',
            content: item.content,
            createTime: item.createTime,
            name: item.name,
            mobile: item.mobile,
            school: item.school,
            studyStage: item.studyStage,
            status: item.status === 0 ? '未读' : '已读'
          }
        })
      })
    },
    handleSearch (form) {
      this.formData = form
      this.getConsultList()
    }
  }
}
</script>
<style lang="less">
.content{
    background:#fff;
    padding:30px 18px 30px 18px;
    .formItem{
      margin-top:30px;
    }
  }
</style>
