<template lang="pug">
  Layout.content
    XTable(ref="table"
    :isTableShow="isTableShow"
    v-model="tableData"
    :search="search"
    :columns="columns"
    :page="page"
    @on-search="handleSearch"
    @on-lookDetail="lookDetail")
</template>
<script>
import XTable from '_c/x-table'
import {
  _getOrderlist
} from '@/api/data.js'
export default {
  data () {
    return {
      isTableShow: true,
      tableData: [],
      noticeId: '',
      columns: [
        { title: '序号', type: 'index', width: 60 },
        { title: '平台', key: 'platform' },
        { title: '订单编号', key: 'number' },
        { title: '商品', key: 'productName' },
        { title: '手机号', key: 'userMobile' },
        { title: '支付状态', key: 'status' },
        { title: '实付款', key: 'payAmount' },
        {
          title: '操作',
          key: 'handle',
          width: 300,
          buttons: [
            {
              name: 'lookDetail',
              render: (h, { row }, vm) => {
                return h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => vm.$emit('on-lookDetail', row)
                  }
                }, '查看')
              }
            }
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
          key: 'orderId',
          label: '订单编号：'
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
            }]
        },
        {
          key: 'phone',
          label: '手机号'
        },
        {
          key: 'status',
          label: '支付状态：',
          select: [
            {
              value: 0,
              label: '已支付'
            },
            {
              value: 1,
              label: '已取消'
            },
            {
              value: 2,
              label: '未支付'
            },
            {
              value: 3,
              label: '已过期'
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
    this.getOrderlist()
  },
  methods: {
    lookDetail (row) {
      let id = row.id
      this.$router.push({ path: `/order/order_detail/${id}` })
    },
    getOrderlist () {
      _getOrderlist({ ...this.formData, pageNum: (this.page.current - 1) * this.page['page-size'], pageSize: this.page['page-size'] }).then(res => {
        this.tableData = res.data.map(item => {
          return {
            id: item.id,
            platform: item.platform === 2 ? '剑少' : '华清园',
            number: item.number,
            productName: item.productName,
            userMobile: item.userMobile,
            status: item.status === 1 ? '已支付' : '已取消',
            payAmount: item.payAmount
          }
        })
      })
    },
    handleSearch (form) {
      this.formData = form
      console.log(form)
    }
  }
}
</script>
<style lang="less">
  .content {
    background:#fff;
    padding:18px 18px 30px 18px;
  }
</style>
