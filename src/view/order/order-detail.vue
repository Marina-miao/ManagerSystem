<template lang="pug">
  Layout.content
    p(class="orderTitle")
     span 订单状态：{{status}}
    p(class="tableTitle") 订单信息
    XTable(ref="table"
    v-model="orderData"
    :isTableShow="isTableShow"
    :columns="orderColumns")
    p(class="tableTitle") 商品信息
    XTable(ref="table"
    v-model="goodsData"
    :isTableShow="isTableShow"
    :columns="GoodsColumns")
    p(class="discountAmount") 优惠： {{discountAmount}}
    p(class="payAmount")
      span 实付款：
      span(style="color:red") {{payAmount}}
    p(class="tableTitle") 备注信息
      p {{userRemark}}
    p(class="tableTitle")
      span 操作记录
      Button(class="addOperate" type="primary" @click="addOperate") 添加
    XTable(ref="table"
    v-model="operateData"
    :isTableShow="isTableShow"
    :columns="operateColumns")
    Modal(v-model="modalShow" @on-ok="save" @on-cancel="cancel")
      p(class="operateTitle") 操作记录
      Input(v-model="operateArea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="")
</template>
<script>
import {
  _getOrderInfor,
  _getGoodsInfor,
  _getOperate,
  _saveOperate
} from '@/api/data.js'
import XTable from '_c/x-table'
export default {
  data () {
    return {
      status: '',
      discountAmount: '',
      payAmount: '',
      userRemark: '',
      operateArea: '',
      orderData: [],
      operateData: [],
      goodsData: [],
      modalShow: false,
      orderId: '',
      areaText: '',
      isTableShow: true,
      orderColumns: [
        { title: '订单编号', key: 'number' },
        { title: '下单时间', key: 'createTime' },
        { title: '买家', key: 'userName' },
        { title: '支付时间', key: 'payTime' },
        { title: '买家手机号', key: 'userMobile' }
      ],
      GoodsColumns: [
        { title: '商品名称', key: 'productName' },
        { title: '班型', key: 'productInfo' },
        { title: '价格', key: 'productPrice' }
      ],
      operateColumns: [
        { title: '时间', key: 'createTime' },
        { title: '操作员', key: 'sysUserName' },
        { title: '内容', key: 'sysUserRemark' }
      ]
    }
  },
  computed: {
  },
  components: {
    XTable
  },
  mounted () {
    this.orderId = this.$route.params.orderId
    this.getOrderInfor()
    this.getGoodsInfor()
    this.getOperate()
  },
  methods: {
    save () {
      let saveData = {
        'sysUserRemark': this.operateArea
      }
      _saveOperate(saveData, this.orderId).then(res => {
        this.$Message.success('保存操作记录成功')
        this.getOperate()
      })
    },
    cancel () {
      this.modalShow = false
    },
    getOperate () {
      _getOperate(this.orderId).then(res => {
        this.operateData = res
      })
    },
    addOperate () {
      this.modalShow = true
    },
    getGoodsInfor () {
      this.goodsData = []
      _getGoodsInfor(this.orderId).then(res => {
        this.goodsData = res
      })
    },
    getOrderInfor () {
      this.orderData = []
      _getOrderInfor(this.orderId).then(res => {
        this.orderData.push(res)
        switch (res.status) {
          case 1:
            this.status = '已支付'
            break
          case 2:
            this.status = '已取消'
            break
          default:
            this.status = '已取消'
        }
        this.discountAmount = res.discountAmount
        this.payAmount = res.payAmount
        this.userRemark = res.userRemark
      })
    }
  }
}
</script>
<style lang="less">
  .content {
    background:#fff;
    padding:18px 18px 30px 18px;
    .modelTitle{
      margin-bottom:10px;
      margin-top:20px;
    }
    .orderTitle{
      font-size: 20px;
      color: #2d8cf0;
      font-weight: bold;
    }
    .tableTitle{
      margin-top:20px;
      font-weight:bold;
      font-size:16px;
    }
    .discountAmount{
      margin-top:20px;
      font-weight:bold;
      font-size:16px;
    }
    .payAmount{
      font-size: 20px;
      margin-top:10px;
      font-weight:bold;
      font-size:16px;
    }
    .addOperate{
      margin-left: 30px;
    }
    .operateTitle{
      margin-top:20px;
      margin-bottom:20px;
    }
  }
</style>
