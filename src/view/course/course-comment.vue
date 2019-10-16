<template lang="pug">
  Layout.content
    Tabs(type="card" :animated="false" value="newComment" @on-click="changeTab")
      TabPane(label="新增评论" name="newComment")
        XTable(ref="newlyTable"
              style="min-height:600px;"
              :isTableShow="newisTableShow"
              v-model="newlyData"
              :columns="newlyColumns"
              :search="newSearch"
              @on-edit="editComment"
              @on-search="handleSearch"
              @on-delete="deleteComment"
              @on-selection-change="selectChange")
          Button(type="primary" style="margin-left:10px;" slot="footer" @click="batchRead") 选中标识已读
      TabPane(label="全部评论" name="allComment" style="padding-top:30px;")
        XTable(ref="table"
              style="min-height:600px;"
              v-model="tableData"
              :isTableShow="isTableShow"
              :columns="columns"
              :search="search"
              :page="page"
              @on-edit="editComment"
              @on-search="handleSearch"
              @on-delete="deleteComment")
          Button(type="primary" style="margin-left:30px;" @click="add" slot="btn") 新建评论
    Modal(v-model="modalShow" @on-ok="save" @on-cancel="cancel")
      div(style="padding-top:40px;")
        Form(ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="90")
          FormItem(label="课程选择：" prop="title")
            Select(v-model="formData.courseId")
              Option(v-for="(item, index) in titleList" :value="item.value" :key="index") {{item.label}}
          FormItem(label="评论内容：" prop="content")
            Input(v-model="formData.content" type="textarea" :autosize="{minRows: 2, maxRows: 5}")
          FormItem(label="评论时间：" prop="createTime")
            DatePicker(type="datetime" style="width: 200px;" v-model="formData.createTime")
          FormItem(label="选择用户：" prop="nick")
            Select(v-model="formData.userId")
              Option(v-for="(item, index) in nickList" :value="item.value" :key="index") {{item.label}}
</template>
<script>
import dayjs from 'dayjs'
import {
  _getTitleList,
  _getNicknames,
  _getCommentlist,
  _saveComment,
  _getCommentDetail,
  _updateComment,
  _deleteComment,
  _updateOpenStatus,
  _updateSort,
  _batchRead
} from '@/api/data.js'
import XTable from '_c/x-table'
export default {
  data () {
    return {
      currentPage: 'newComment',
      modalShow: false,
      newlyData: [],
      tableData: [],
      isTableShow: false,
      newisTableShow: true,
      formData: {},
      ruleValidate: {
        title: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, type: 'date', message: '不能为空', trigger: 'blur' }
        ],
        nick: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      newlyColumns: [
        { title: '全选', type: 'selection', width: 130 },
        { title: '序号', type: 'index', width: 80 },
        { title: '平台', key: 'platformStr', width: 140 },
        { title: '评论', key: 'content' },
        { title: '时间', key: 'createTime', width: 150 },
        { title: '课程', key: 'courseTitle' },
        { title: '用户', key: 'userName' },
        { title: '公开',
          key: 'status',
          width: 120,
          render: (h, params) => {
            return (params.row.status === 1) ? h('div', [
              h('Icon', {
                props: {
                  type: 'md-checkmark-circle',
                  size: '20'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let commentId = params.row.id
                    _updateOpenStatus(commentId, { undisclosed: true }).then(res => {
                      this.$Message.success('不公开成功')
                      this.getNewComment()
                    })
                  }
                }
              })
            ]) : h('div', [
              h('Icon', {
                props: {
                  type: 'ios-close-circle',
                  size: '20'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let commentId = params.row.id
                    _updateOpenStatus(commentId, { undisclosed: false }).then(res => {
                      this.$Message.success('公开成功')
                      this.getNewComment()
                    })
                  }
                }
              })
            ])
          }
        },
        {
          title: '操作',
          key: 'handle',
          width: 200,
          buttons: [
            { name: 'edit', text: '编辑', type: 'primary' },
            'delete'
          ]
        }
      ],
      columns: [
        { title: '序号', type: 'index', width: 60 },
        { title: '平台', key: 'platformStr', width: 140 },
        { title: '评论', key: 'content' },
        { title: '时间', key: 'createTime', width: 150 },
        { title: '课程', key: 'courseTitle' },
        { title: '用户', key: 'userName' },
        { title: '公开',
          key: 'status',
          width: 120,
          render: (h, params) => {
            return (params.row.status === 1) ? h('div', [
              h('Icon', {
                props: {
                  type: 'md-checkmark-circle',
                  size: '20'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let commentId = params.row.id
                    _updateOpenStatus(commentId, { undisclosed: true }).then(res => {
                      this.$Message.success('不公开成功')
                      this.getCommentlist()
                    })
                  }
                }
              })
            ]) : h('div', [
              h('Icon', {
                props: {
                  type: 'ios-close-circle',
                  size: '20'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    let commentId = params.row.id
                    _updateOpenStatus(commentId, { undisclosed: false }).then(res => {
                      this.$Message.success('公开成功')
                      this.getCommentlist()
                    })
                  }
                }
              })
            ])
          }
        },
        {
          title: '操作',
          key: 'handle',
          width: 200,
          buttons: [
            { name: 'edit', text: '编辑', type: 'primary' },
            'delete'
          ]
        }
      ],
      page: {
        current: 1,
        total: 0,
        'page-size': 10
      },
      titleList: [],
      nickList: [],
      commentId: '',
      searchForm: {},
      sortOrder: '',
      selections: []
    }
  },
  computed: {
    newSearch () {
      return [
        {
          key: 'platform',
          label: '课程平台：',
          isFilter: false,
          select: [
            {
              value: 2,
              label: '剑少五级'
            },
            {
              value: 1,
              label: '华清园'
            },
            {
              value: 0,
              label: '剑少 华清园'
            }
          ]
        }
      ]
    },
    search () {
      return [
        {
          key: 'platform',
          label: '课程平台：',
          isFilter: false,
          select: [
            {
              value: 2,
              label: '剑少五级'
            },
            {
              value: 1,
              label: '华清园'
            },
            {
              value: 0,
              label: '剑少 华清园'
            }
          ]
        },
        {
          key: 'titleId',
          label: '课程标题：',
          isFilter: false,
          select: this.titleList
        },
        {
          key: 'nickNameId',
          label: '用户昵称',
          isFilter: true,
          select: this.nickList
        }
      ]
    }
  },
  components: {
    XTable
  },
  mounted () {
    this.getTitleList()
    this.getNicknames()
    if (this.currentPage === 'newComment') {
      this.getNewComment()
    } else {
      this.getCommentlist()
    }
  },
  methods: {
    selectChange (selections) {
      this.selections = selections
    },
    batchRead () {
      let markIds = []
      this.selections.forEach(item => {
        markIds.push(item.id)
      })
      _batchRead(markIds).then(res => {
        this.$Message.success('标记已读成功')
      })
    },
    changeTab (name) {
      this.currentPage = name
      this.searchForm = {}
      if (this.currentPage === 'newComment') {
        this.getNewComment()
      } else {
        this.getCommentlist()
      }
    },
    // 查询新增评论列表
    getNewComment () {
      _getCommentlist({ ...this.searchForm, pageNum: (this.page.current - 1) * this.page['page-size'], pageSize: this.page['page-size'] }).then(res => {
        this.newlyData = res.data.map(item => {
          return {
            id: item.id,
            courseId: item.courseId,
            platformStr: item.platform === 2 ? '剑少五级' : (item.platform === 1) ? '华清园' : '剑少五级 华清园',
            content: item.content,
            createTime: item.createTime,
            courseTitle: item.courseTitle,
            userName: item.userName,
            orderNum: item.orderNum,
            status: item.status,
            userId: item.userId
          }
        })
      })
    },
    deleteComment (params) {
      let commentId = params.row.id
      _deleteComment(commentId).then(res => {
        this.$Message.success('删除评论成功')
        if (this.currentPage === 'newComment') {
          this.getNewComment()
        } else {
          this.getCommentlist()
        }
      })
    },
    editComment (params) {
      this.commentId = params.row.id
      _getCommentDetail(this.commentId).then(res => {
        this.modalShow = true
        let { courseId, content, createTime, userId } = res
        this.formData = { courseId, content, createTime, userId }
      })
    },
    save () {
      let createTime = dayjs(this.formData.createTime).format('YYYY-MM-DD HH:mm:ss')
      let courseId = this.formData.courseId
      let courseTitle = this.titleList.filter(item => {
        return item.value === courseId
      })[0].label
      let userId = this.formData.userId
      let userName = this.nickList.filter(item => {
        return item.value === userId
      })[0].label
      let platform = this.titleList.filter(item => {
        return item.value === courseId
      })[0].platform
      let content = this.formData.content
      let data = { courseId, courseTitle, userId, userName, content, createTime, platform }
      if (!this.commentId) {
        // 保存新建评论
        _saveComment(data).then(res => {
          this.$Message.success('新建评论成功')
          this.getCommentlist()
        })
      } else {
        // 更新编辑评论
        _updateComment(data, this.commentId).then(res => {
          this.formData = res
          if (this.currentPage === 'newComment') {
            this.getNewComment()
          } else {
            this.getCommentlist()
          }
        })
      }
    },
    cancel () {

    },
    add () {
      this.modalShow = true
      this.formData = {}
    },
    // 查询全部评论列表
    getCommentlist () {
      // 根据搜索内容选项构建排序或不能排序的表格columns并渲染数据
      let courseTitle = ''
      let userName = ''
      let platform = this.searchForm['platform'] > 0 ? this.searchForm['platform'] : this.searchForm['platform'] === 0 ? 0 : ''
      if (this.searchForm.titleId) {
        courseTitle = this.titleList.filter(item => {
          return item.value === this.searchForm.titleId
        })[0].label
      } else {
        courseTitle = ''
      }
      if (this.searchForm.nickNameId) {
        userName = this.nickList.filter(item => {
          return item.value === this.searchForm.nickNameId
        })[0].label
      } else {
        userName = ''
      }
      let searchData = { platform: platform, courseTitle: courseTitle, userName: userName }
      if (searchData['courseTitle'] && !searchData['userName']) {
        // 能排序
        if (this.columns[6].title !== '排序') {
          this.columns.splice(6, 0, { title: '排序',
            key: 'orderNum',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('Input', {
                  props: {
                    value: '0'
                  },
                  style: {
                  },
                  on: {
                    'on-change': (event) => {
                      this.sortOrder = event.target.value
                    },
                    'on-blur': () => {
                      let commnetId = params.row.id
                      _updateSort(commnetId, { num: this.sortOrder }).then(res => {
                        this.$Message.success('排序成功')
                        this.getCommentlist()
                      })
                    }
                  }
                })
              ])
            }
          })
        }
      } else {
        // 不能排序
        if (this.columns[6].title === '排序') {
          this.columns.splice(6, 1)
        }
      }
      _getCommentlist({ ...searchData, pageNum: (this.page.current - 1) * this.page['page-size'], pageSize: this.page['page-size'] }).then(res => {
        this.isTableShow = true
        this.page['total'] = res.total
        this.tableData = res.data.map(item => {
          return {
            id: item.id,
            courseId: item.courseId,
            platformStr: item.platform === 2 ? '剑少五级' : (item.platform === 1) ? '华清园' : '剑少五级 华清园',
            content: item.content,
            createTime: item.createTime,
            courseTitle: item.courseTitle,
            userName: item.userName,
            orderNum: item.orderNum,
            status: item.status,
            userId: item.userId
          }
        })
      })
    },
    getNicknames () {
      _getNicknames('APP20190807150100249').then(res => {
        this.nickList = res['加盟校校长'].map(item => {
          return { value: item.id, label: item.appusernick }
        })
      })
    },
    getTitleList () {
      _getTitleList().then(res => {
        this.titleList = res.map(item => {
          return { value: item.id, label: item.title, platform: item.platform }
        })
      })
    },
    handleSearch (form) {
      this.searchForm = form
      if (this.currentPage === 'newComment') {
        this.getNewComment()
      } else {
        this.getCommentlist()
      }
    }
  }
}
</script>
<style lang="less">
  .content{
    background:#fff;
    padding:18px 18px 70px 18px;
  }
</style>
