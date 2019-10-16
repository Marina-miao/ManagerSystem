<template lang="pug">
  Layout.content
    Button(type="primary" style="width:80px;margin-bottom:20px;" @click="addNotice") 添加
    XTable(ref="table"
    :isTableShow="isTableShow"
    v-model="tableData"
    :columns="columns"
    :page="page"
    @on-delete="deleteNotice"
    @on-edit="editNotice")
    Modal(v-model="modalShow")
      p(slot="header")
        span 添加文字广告
      Form.formBox(ref="formInline" :rules="ruleValidate" :model="noticeData" label-position="top")
        FormItem(label="通知标题：" prop="title")
          Input(v-model="noticeData.title" placeholder="")
        FormItem(label="链接地址：" prop="url")
          Input(v-model="noticeData.url" placeholder="")
      div(slot="footer")
        Button(type="text" @click="cancel") 取消
        Button(type="primary" @click="save") 确定
</template>
<script>
import XTable from '_c/x-table'
import {
  _saveNotice,
  _getNoticeList,
  _deleteNotice,
  _getNoticeDetail,
  _updateNotice
} from '@/api/data.js'
export default {
  data () {
    return {
      isTableShow: true,
      tableData: [],
      noticeId: '',
      columns: [
        { title: '通知标题', key: 'title' },
        { title: '链接地址', key: 'url' },
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
      noticeData: {
        title: '',
        url: ''
      },
      ruleValidate: {
        title: [
          { required: true, message: '通知标题不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '链接地址不能为空', trigger: 'blur' }
        ]
      },
      modalShow: false,
      page: {
        current: 1,
        total: 0,
        'page-size': 10
      }
    }
  },
  computed: {

  },
  components: {
    XTable
  },
  mounted () {
    this.getNoticeList()
  },
  methods: {
    cancel () {
      this.modalShow = false
    },
    editNotice (row) {
      this.noticeId = row.id
      this.modalShow = true
      _getNoticeDetail(this.noticeId).then(res => {
        this.noticeData = res
      })
    },
    deleteNotice (params) {
      this.noticeId = params.row.id
      _deleteNotice(this.noticeId).then(res => {
        this.$Message.success('删除成功')
        this.getNoticeList()
      })
    },
    getNoticeList () {
      _getNoticeList({ pageNum: (this.page.current - 1) * this.page['page-size'], pageSize: this.page['page-size'] }).then(res => {
        this.page['total'] = res.total
        this.tableData = res.data
      })
    },
    save () {
      // 新建文字广告
      if (!this.noticeId) {
        _saveNotice(this.noticeData).then(res => {
          this.$Message.success('添加成功')
          this.modalShow = false
          this.getNoticeList()
        })
      } else {
        // 更新文字广告
        _updateNotice(this.noticeData, this.noticeId).then(res => {
          this.$Message.success('编辑成功')
          this.modalShow = false
          this.getNoticeList()
        })
      }
    },
    addNotice () {
      this.noticeData = {}
      this.noticeId = ''
      this.modalShow = true
    }
  }
}
</script>
<style lang="less">

</style>
