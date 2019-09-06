<template lang="pug">
  Layout.content
    XTable(ref="table" v-model="tableData" :columns="columns" :search="search" :page="page" @on-search="handleSearch" @on-edit="editCourse")
      Button(type="primary") 新增课程
    Modal(v-model="modalShow" @on-ok="save" @on-cancel="cancel")

</template>

<script>
import { mapState } from 'vuex'
import XTable from '_c/x-table'
import { getCourses } from '@/api/data'

export default {
  name: 'home',
  components: { XTable },
  data () {
    return {
      modalShow: false,
      tableData: [],
      form: {},
      columns: [
        { title: '序号', type: 'index', width: 60 },
        { title: '平台', key: 'courseFromStr' },
        { title: '课程标题', key: 'name' },
        { title: '类型', key: 'typeString' },
        { title: '价格', key: 'price' },
        { title: '操作',
          key: 'handle',
          width: 300,
          buttons: [{ name: 'edit', text: '编辑' }, { name: 'online', text: '下线' }, 'delete']
        }
      ],
      page: {
        current: 1,
        total: 1,
        'page-size': 10
      }
    }
  },
  computed: {
    ...mapState({
      // roleId: state => state.user.info.roleId
    }),
    search () {
      return []
    }
  },
  mounted () {
    this.getAllCourse()
  },
  methods: {
    editCourse (event) {
      let courseId = event.row.id
      let courseType = event.row.type
      if (courseType === 1) {
        this.$router.push({ path: `course_onlineDetail/${courseId}` })
      }
      if (courseType === 0) {
        this.$router.push({ path: `course_offlineDetail/${courseId}` })
      }
    },
    getAllCourse () {
      getCourses({ ...this.form, pageNum: (this.page.current - 1) * this.page['page-size'], pageSize: this.page['page-size'] }).then(res => {
        this.tableData = res.data.map((item) => {
          return { ...item, typeString: item.type === 0 ? '线下' : '录播', courseFromStr: item.courseFrom === 1 ? '剑桥五级' : '华清园课程站' }
        })
      }).catch(e => {
      })
    },
    handleSearch (form) {
      this.form = form
    },
    save () {},
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
