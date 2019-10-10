<template lang="pug">
  Layout.content
    XTable(ref="table"
    v-model="tableData"
    :isTableShow="isTableShow"
    :columns="columns"
    :search="search"
    :page="page"
    @on-search="handleSearch"
    @on-edit="editCourse"
    @on-delete="deleteRow"
    @on-online="changeLine"
    @on-page-change="pageChange"
    @on-editTimetable="editTimetable"
    @on-editCatalog="editCatalog")
      Button(type="primary" style="margin-left:30px;" @click="addCourse" slot="btn") 新建课程
    Modal(v-model="modalShow" @on-ok="save" @on-cancel="cancel")
      p(slot="header")
        span 新建课程
      div
        p(style="margin-bottom:20px") 选择新建的课程类型：
        RadioGroup(v-model="typeStr" @on-change="typeChange")
          Radio(label="面授")
          Radio(label="线上")
</template>
<script>
import { mapState } from 'vuex'
import XTable from '_c/x-table'
import {
  _getCourses,
  _deleteCourse,
  _offlineCourse
} from '@/api/data'
export default {
  name: 'home',
  components: { XTable },
  data () {
    return {
      modalShow: false,
      isTableShow: true,
      tableData: [],
      form: {},
      columns: [
        { title: '序号', type: 'index', width: 60 },
        { title: '平台', key: 'courseFromStr' },
        { title: '课程标题', key: 'title' },
        { title: '类型', key: 'typeString' },
        { title: '价格', key: 'price' },
        {
          title: '操作',
          key: 'handle',
          width: 200,
          buttons: [
            {
              name: 'edit',
              render: (h, { row }, vm) => {
                return h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: row.status === 0
                  },
                  on: {
                    click: () => vm.$emit('on-edit', row)
                  }
                }, '编辑介绍')
              }
            },
            {
              name: 'editTimetable',
              render: (h, { row }, vm) => {
                return row.type === 0 ? h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: row.status === 0
                  },
                  on: {
                    click: () => vm.$emit('on-editTimetable', row)
                  }
                }, '编辑课表') : ''
              }
            },
            {
              name: 'editTimetable',
              render: (h, { row }, vm) => {
                return row.type === 1 ? h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: row.status === 0
                  },
                  on: {
                    click: () => vm.$emit('on-editCatalog', row)
                  }
                }, '编辑目录') : ''
              }
            },
            {
              name: 'custom',
              render: (h, { row }, vm) => {
                return h('Button', {
                  props: {
                    type: row.status === 0 ? 'warning' : 'primary', size: 'small'
                  },
                  on: {
                    click: () => vm.$emit('on-online', row)
                  }
                }, row.status === 1 ? '下线' : '上线')
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
      },
      type: 0,
      typeStr: '面授'
    }
  },
  computed: {
    ...mapState({
      // roleId: state => state.user.info.roleId
    }),
    search () {
      return [
        {
          key: 'title',
          label: '课程关键字：'
        },
        {
          key: 'type',
          label: '分类：',
          select: [
            {
              value: 0,
              label: '面授'
            },
            {
              value: 1,
              label: '线上'
            }]
        }
      ]
    }
  },
  mounted () {
    this.getPageCourse()
  },
  methods: {
    editCatalog (row) {
      let courseId = row.id
      this.$router.push({ path: `/course/course_catalog`, query: { courseId: courseId, isNewCatalog: 0 } })
    },
    editTimetable (row) {
      let courseId = row.id
      this.$router.push({ path: `/course/course_timetable`, query: { courseId: courseId, isNewtable: 0 } })
    },
    typeChange (val) {
      if (val === '面授') {
        this.type = 0
      }
      if (val === '线上') {
        this.type = 1
      }
    },
    addCourse () {
      this.modalShow = true
    },
    pageChange (currentPage) {
      this.page.current = currentPage
      this.getPageCourse()
    },
    changeLine (row) {
      let courseId = row.id
      if (row.status === 0) {
        // 上线该课程
        _offlineCourse({ courseId: courseId, status: 1 }).then(res => {
          this.$Message.success('上线成功')
          this.getPageCourse()
        })
      }
      if (row.status === 1) {
        // 下线该课程
        _offlineCourse({ courseId: courseId, status: 0 }).then(res => {
          this.$Message.success('下线成功')
          this.getPageCourse()
        })
      }
    },
    deleteRow (params) {
      let courseId = params.row.id
      // 删除当前row
      _deleteCourse({ courseId: courseId }).then(res => {
        this.$Message.success('删除课程成功')
        // 当前页的最后一行也被删除之后
        let totalPage = 0
        _getCourses().then(res => {
          totalPage = res.total
          if (this.page.current > 1 && totalPage === (this.page.current - 1) * this.page['page-size']) {
            this.page.current -= 1
          }
          this.getPageCourse()
        })
      })
    },
    editCourse (row) {
      // if (row.status === 0) {
      //   this.$Message.warning('该课程已下线')
      //   return
      // }
      let courseId = row.id
      let courseType = row.type
      if (courseType === 1) {
        this.$router.push({ path: `/course/course_onlineDetail/${courseId}` })
      }
      if (courseType === 0) {
        this.$router.push({ path: `/course/course_offlineDetail/${courseId}` })
      }
    },
    getPageCourse () {
      _getCourses({ ...this.form, pageNum: (this.page.current - 1) * this.page['page-size'], pageSize: this.page['page-size'] }).then(res => {
        this.page['total'] = res.total
        this.tableData = res.data.map((item) => {
          return {
            ...item,
            typeString: item.type === 0 ? '面授' : '线上',
            courseFromStr: item.platform === 2 ? '剑桥五级' : item.platform === 1 ? '华清园课程站' : '剑桥五级  华清园课程站'
          }
        })
      }).catch(e => {
      })
    },
    handleSearch (form) {
      this.form = form
      this.getPageCourse()
    },
    save () {
      let add = 'add'
      if (this.type === 0) {
        this.$router.push({ path: `course_offlineDetail/${add}` })
      }
      if (this.type === 1) {
        this.$router.push({ path: `course_onlineDetail/${add}` })
      }
    },
    cancel () {}
  }
}
</script>

<style lang="less">
  .content{
    background:#fff;
    padding:18px 18px 30px 18px;
  }
</style>
