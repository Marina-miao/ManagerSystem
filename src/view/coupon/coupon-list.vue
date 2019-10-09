<template lang="pug">
  Layout.content
    XTable(ref="table"
    :isTableShow="isTableShow"
    v-model="tableData"
    :columns="columns"
    :search="search"
    :page="page"
    @on-search="handleSearch"
    @on-edit="edit"
    @on-delete="deleteRow")
      Button(type="primary" style="margin-left:30px;" @click="addCoupon" slot="btn") 新增优惠券
</template>

<script>
import XTable from '_c/x-table'
import {
  _getCouponList,
  _deleteCoupon
} from '@/api/data.js'
export default {
  data () {
    return {
      page: {
        current: 1,
        total: 0,
        'page-size': 10
      },
      isTableShow: true,
      formData: {},
      tableData: [],
      columns: [
        { title: '序号', type: 'index', width: 60 },
        { title: '平台', key: 'platform' },
        { title: '优惠券名称', key: 'name' },
        { title: '种类', key: 'type' },
        { title: '开始时间', key: 'startTime' },
        { title: '结束时间', key: 'endTime' },
        { title: '状态', key: 'status' },
        {
          title: '操作',
          key: 'handle',
          width: 400,
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
      ]
    }
  },
  components: {
    XTable
  },
  mounted () {
    this.getCouponList()
  },
  computed: {
    search () {
      return [
        {
          key: 'name',
          label: '优惠券名称：'
        },
        {
          key: 'platform',
          label: '平台',
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
          key: 'type',
          label: '种类',
          select: [
            {
              value: 1,
              label: '代金券'
            },
            {
              value: 2,
              label: '折扣券'
            },
            {
              value: 3,
              label: '满折券'
            }
          ]
        },
        {
          key: 'status',
          label: '状态',
          select: [
            {
              value: 0,
              label: '未开始'
            },
            {
              value: 1,
              label: '进行中'
            },
            {
              value: 2,
              label: '已过期'
            }
          ]
        }
      ]
    }
  },
  methods: {
    deleteRow (params) {
      let couponId = params.row.id
      _deleteCoupon(couponId).then(res => {
        this.$Message.success('删除优惠券成功')
        this.getCouponList()
      })
    },
    edit (row) {
      let couponId = row.id
      this.$router.push({ path: `coupon_detail/${couponId}` })
    },
    addCoupon () {
      this.$router.push({ path: `coupon_detail/add` })
    },
    getCouponList () {
      _getCouponList({ ...this.formData, pageNum: (this.page.current - 1) * this.page['page-size'], pageSize: this.page['page-size'] }).then(res => {
        this.page['total'] = res.total
        this.tableData = res.data.map(item => {
          return {
            id: item.id,
            platform: item.platform === 2 ? '剑少五级' : item.platform === 1 ? '华清园' : '华清园 剑少五级',
            name: item.name,
            type: item.type === 1 ? '代金券' : item.type === 2 ? '折扣券' : '满折券',
            startTime: item.startTime,
            endTime: item.endTime,
            status: item.status
          }
        })
      })
    },
    handleSearch (form) {
      this.formData = form
      this.getCouponList()
      console.log(this.formData)
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
