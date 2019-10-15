<template lang="pug">
  Layout.content
    XTable(ref="table"
    v-model="tableData"
    :isTableShow="isTableShow"
    :columns="columns"
    :search="search"
    :page="page"
    @on-search="handleSearch"
    @on-selection-change="selectChange"
    @on-markread="markread"
    @on-delete="deleteRow")
      Button(type="primary" style="margin-left:10px;margin-right:16px;" slot="footer" @click="batchRead") 选中标识已读
      Button(type="primary" slot="footer" @click="") 批量导出
</template>
<script>
import XTable from '_c/x-table'
import {
  _getActiveTitles,
  _getActiveSignlist,
  _batchRead,
  _markread,
  _deleteRow
} from '@/api/data.js'
export default {
  data () {
    return {
      isTableShow: true, // 表格显示隐藏
      markeReadIds: [],
      formData: {},
      activeTitles: [],
      columns: [
        { type: 'selection', title: '全选', width: '70px' },
        { type: 'index', title: '序号', width: '70px' },
        { title: '平台', key: 'platform' },
        { title: '活动标题', key: 'activityTitle', width: '90px' },
        { title: '姓名', key: 'name' },
        { title: '电话', key: 'phone' },
        { title: '学校', key: 'school' },
        { title: '年级', key: 'schoolGrade' },
        { title: '活动场次', key: 'selectedVenue', width: '90px' },
        { title: '提交时间', key: 'submitTime', width: '90px' },
        { title: '状态', key: 'readStatus' },
        {
          title: '操作',
          key: 'handle',
          width: 170,
          buttons: [
            {
              name: 'markread',
              render: (h, { row }, vm) => {
                return h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => vm.$emit('on-markread', row)
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
      }
    }
  },
  computed: {
    search () {
      return [
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
          key: 'title',
          label: '活动名称：',
          select: this.activeTitles
        },
        {
          key: 'sort',
          label: '活动分类：',
          select: [
            {
              value: 2,
              label: '进行中'
            },
            {
              value: 3,
              label: '已结束'
            },
            {
              value: 1,
              label: '活动预告'
            }
          ]
        },
        {
          key: 'phone',
          label: '电话：'
        },
        {
          key: 'readStatus',
          label: '状态：',
          select: [
            {
              value: 0,
              label: '未读'
            },
            {
              value: 1,
              label: '已读'
            }
          ]
        }
      ]
    }
  },
  components: {
    XTable
  },
  mounted () {
    this.getActiveTitles()
    this.getActiveSignlist()
  },
  methods: {
    deleteRow (params) {
      let id = params.row.id
      _deleteRow(id).then(res => {
        this.$Message.success('删除报名成功')
        this.getActiveSignlist()
      })
    },
    markread (row) {
      let id = row.id
      _markread(id).then(res => {
        this.$Message.success('标记已读成功')
        this.getActiveSignlist()
      })
    },
    selectChange (selection) {
      this.markeReadIds = selection.map(item => {
        return item.id
      })
    },
    batchRead () {
      _batchRead({ ids: this.markeReadIds }).then(res => {
        this.$Message.success('批量已读成功')
        this.getActiveSignlist()
      })
    },
    getActiveSignlist () {
      _getActiveSignlist({ ...this.formData, pageNum: (this.page.current - 1) * this.page['page-size'], pageSize: this.page['page-size'] }).then(res => {
        this.page['total'] = res.total
        this.tableData = res.data.map(item => {
          return {
            id: item.id,
            platform: item.platform === 2 ? '剑少五级' : item.platform === 1 ? '华清园' : '剑少五级 华清园',
            activityTitle: item.activityTitle,
            name: item.name,
            phone: item.phone,
            school: item.school,
            schoolGrade: item.schoolGrade,
            selectedVenue: item.selectedVenue,
            submitTime: item.submitTime,
            readStatus: item.readStatus === 0 ? '未读' : '已读'
          }
        })
      })
    },
    getActiveTitles () {
      _getActiveTitles(0).then(res => {
        this.activeTitles = res.map(item => {
          return {
            value: item.id,
            label: item.title
          }
        })
      })
    },
    handleSearch (form) {
      this.formData = form
      this.getActiveSignlist()
    }
  }
}
</script>
<style lang="less">
  .content {
    background:#fff;
    padding:18px 18px 30px 18px;
  }
  .formItem{
    margin-top:30px;
  }
</style>
