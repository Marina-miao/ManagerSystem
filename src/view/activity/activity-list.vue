<template lang="pug">
  Layout.content
    XTable(ref="table"
    v-model="tableData"
    :isTableShow="isTableShow"
    :columns="columns"
    :search="search"
    :page="page"
    @on-delete="deleteActive"
    @on-edit="editActive"
    @on-search="handleSearch")
      Button(type="primary" style="margin-left:30px;" @click="addActive" slot="btn") 新建活动
</template>
<script>
import XTable from '_c/x-table'
import {
  _getActiveList,
  _deleteActive
} from '@/api/data.js'
export default {
  data () {
    return {
      isTableShow: true,
      tableData: [],
      formData: {},
      columns: [
        { title: '序号', type: 'index', width: 60 },
        { title: '平台', key: 'platform', width: 150 },
        { title: '标题', key: 'title' },
        { title: '分类', key: 'sort' },
        { title: '发布时间', key: 'publishTime' },
        { title: '是否推荐', key: 'pushFlag' },
        {
          title: '操作',
          key: 'handle',
          width: 300,
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
          key: 'title',
          label: '标题关键字：'
        },
        {
          key: 'platform',
          label: '平台：',
          select: [
            {
              value: 0,
              label: '剑少五级'
            },
            {
              value: 1,
              label: '华清园'
            }]
        },
        {
          key: 'sort',
          label: '分类：',
          select: [
            {
              value: 2,
              label: '进行中'
            },
            {
              value: 1,
              label: '活动预告'
            },
            {
              value: 3,
              label: '已结束'
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
    this.getActiveList()
  },
  methods: {
    editActive (row) {
      let activityId = row.id
      this.$router.push({ path: `/activity/activity_detail/${activityId}` })
    },
    addActive () {
      this.$router.push({ path: `/activity/activity_detail/add` })
    },
    deleteActive (params) {
      let activityId = params.row.id
      _deleteActive(activityId).then(res => {
        this.$Message.success('删除成功')
        this.getActiveList()
      })
    },
    getActiveList () {
      _getActiveList({ ...this.formData, pageNum: (this.page.current - 1) * this.page['page-size'], pageSize: this.page['page-size'] }).then(res => {
        this.page['total'] = res.total
        this.tableData = res.data.map(item => {
          return {
            id: item.id,
            title: item.title,
            platform: item.platform === 2 ? '剑少五级' : item.platform === 1 ? '华清园' : '剑少五级 华清园',
            sort: item.sort === 1 ? '活动预告' : item.sort === 2 ? '进行中' : '已结束',
            publishTime: item.publishTime,
            pushFlag: item.pushFlag === 1 ? '是 ' : '否'
          }
        })
      })
    },
    handleSearch (form) {
      this.formData = form
      this.getActiveList()
    }
  }
}
</script>
<style lang="less">
  .content{
    background:#fff;
    padding:18px 18px 30px 18px;
  }
</style>
