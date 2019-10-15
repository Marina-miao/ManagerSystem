<template lang="pug">
  Layout.content
    XTable(ref="table"
    v-model="tableData"
    :isTableShow="isTableShow"
    :columns="columns"
    :search="search"
    :page="page"
    @on-search="handleSearch"
    @on-edit="editCupmatch"
    @on-delete="deleteCup")
      Button(type="primary" slot="footer" @click="batchExport" class="export") 批量导出
</template>
<script>
import XTable from '_c/x-table'
import {
  _getActiveTitles,
  _getCupmatchList,
  _deleteCup
} from '@/api/data.js'
export default {
  data () {
    return {
      isTableShow: true, // 表格显示隐藏
      formData: {},
      cupTitles: [],
      columns: [
        { type: 'selection', title: '全选', width: 70 },
        { type: 'index', title: '序号', width: 70 },
        { title: '活动标题', key: 'activityTitle' },
        { title: '姓名', key: 'name', width: 150 },
        { title: '电话', key: 'phone', width: 150 },
        { title: '提交时间', key: 'createTime' },
        { title: '缴费状态', key: 'paymentStatus', width: 100 },
        {
          title: '操作',
          key: 'handle',
          width: 170,
          buttons: [
            {
              name: 'edit',
              render: (h, { row }, vm) => {
                return h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => vm.$emit('on-edit', row)
                  }
                }, '编辑')
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
          label: '杯赛名称：',
          select: this.cupTitles
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
    this.getCupmatchTitles()
    this.getCupmatchList()
  },
  methods: {
    deleteCup (params) {
      let id = params.row.id
      _deleteCup(id).then(res => {
        this.$Message.success('删除成功')
        this.getCupmatchList()
      })
    },
    editCupmatch (row) {
      let id = row.id
      this.$router.push({ path: `/activity/cupMatch_detail/${id}` })
    },
    batchExport () {

    },
    getCupmatchList () {
      _getCupmatchList({ ...this.formData, pageNum: (this.page.current - 1) * this.page['page-size'], pageSize: this.page['page-size'] }).then(res => {
        this.tableData = res.data.map(item => {
          return {
            id: item.id,
            activityTitle: item.activityTitle,
            name: item.name,
            phone: item.phone,
            createTime: item.createTime,
            paymentStatus: item.paymentStatus === 0 ? '未缴费' : '已缴费'

          }
        })
      })
    },
    getCupmatchTitles () {
      _getActiveTitles(1).then(res => {
        this.cupTitles = res.map(item => {
          return {
            value: item.id,
            label: item.title
          }
        })
      })
    },
    handleSearch (form) {
      this.formData = form
    }
  }
}
</script>
<style lang="less">
  .content{
    background:#fff;
    padding:18px 18px 30px 18px;
  }
  .formItem{
    margin-top:30px;
  }
  .export{
    margin-left:20px;
  }
</style>
