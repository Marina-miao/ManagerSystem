<template lang="pug">
  Layout.layoutBox
    Form.formBox(ref="formInline" :model="formData" :rules="ruleValidate" :label-width="100")
      FormItem(label="平台：" prop="platformGroup")
        CheckboxGroup(v-model="formData.platformGroup")
          Checkbox(label="剑少五级")
          Checkbox(label="华清园")
      FormItem(label="优惠券名称：" prop="name")
        Input(v-model="formData.name" placeholder="" style="width:630px;")
      FormItem(label="种类：" prop="type")
        RadioGroup(v-model="formData.type")
          p(class="radioP")
            Radio(label="voucher" class="formLable") 代金券
            span(class="inputLable") 面值：
            InputNumber.inputNum(v-model="formData.voucherValue" placeholder="" :min="0" class="valueInput")
          p(class="radioP")
            Radio(label="discount" class="formLable") 折扣券
            span(class="inputLable") 折扣值：
            InputNumber.inputNum(v-model="formData.discountValue" placeholder="" :min="0" class="valueInput")
          p(class="radioP")
            Radio(label="FullCoupon" class="formLable") 满折券
            span(class="inputLable") 面值：
            InputNumber.inputNum(v-model="formData.FullCouponValue" placeholder="" :min="0" class="valueInput")
            span(class="inputLable") 折扣值：
            InputNumber.inputNum(v-model="formData.FullCouponDiscount" placeholder="" :min="0" class="valueInput")
      FormItem(label="使用条件：" prop="condition" style="margin-bottom:0px;")
        CheckboxGroup(v-model="formData.condition")
          p(class="radioP")
            Checkbox(label="满" class="formLable")
            InputNumber.inputNum(v-model="formData.conditionMoney" placeholder="" :min="0" class="valueInput")
            span 元可使用
          p(class="radioP")
            Checkbox(label="报名" class="formLable")
            InputNumber.inputNum(v-model="formData.conditionCourseNum" placeholder="" :min="0" class="valueInput")
            span  个课程班
          p(class="radioP")
            Checkbox(label="适用课程" class="formLable")
        Card(class="selectCard" style="" v-if="conditionCourse.length != 0")
          p(slot="title" class="cardTitle") 已选择的适用课程
          p(v-for="(item, index) in conditionCourse")
            span {{item.title}}
            Button(type="primary" size="small" style="float:right" @click="deleteSelect(index)") 删除
        Card(class="selectCard")
          p(slot="title"  class="cardTitle") 请搜索或选择课程
            Button(type="primary" style="float:right;" @click="saveSelect") 确定
          p
            Select(v-model="searchTitle" filterable style="width:100%;" clearable)
              Option(v-for="item in courseTitles" :value="item.title" :key="item.title") {{ item.title }}
          Tree(:data="treeData" show-checkbox @on-check-change="checkChange" class="tree")
      FormItem(label="有效时间：" prop="startTime")
        DatePicker(type="datetime" class="dateTime" v-model="formData.startTime" placeholder="请输入开始时间")
      FormItem(label="" prop="endTime" style="float:left;")
        DatePicker(type="datetime" class="dateTime" v-model="formData.endTime" placeholder="请输入结束时间")

    p(class="btnBottom")
      Button(style="margin-right:20px;" @click="back") 返回
      Button(type="primary" @click="save") 新增
</template>

<script>
import dayjs from 'dayjs'
import {
  _getTitleList,
  _saveCoupon,
  _getCouponDetail
} from '@/api/data.js'
export default {
  data () {
    return {
      couponId: '',
      formData: {
        voucherValue: null,
        discountValue: null,
        FullCouponValue: null,
        FullCouponDiscount: null,
        conditionMoney: null,
        conditionCourseNum: null,
        condition: []
      },
      searchTitle: '',
      treeSelect: [], // 树菜单选中课程
      conditionCourse: [], // 适用课程json
      levelfiveCourse: [],
      huaqingCourse: [],
      courseTitles: [],
      selectCourselist: [],
      ruleValidate: {
        platformGroup: [
          { required: true, type: 'array', min: 1, message: '必须至少选择一个平台', trigger: 'change' },
          { type: 'array', max: 1, message: '请单个平台编辑', trigger: 'change' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择种类', trigger: 'change' }
        ],
        startTime: [
          { required: true, type: 'date', message: '请选择时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, type: 'date', message: '请选择时间', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    treeData () {
      return [
        {
          title: '剑桥五级',
          expand: true,
          children: this.levelfiveCourse
        },
        {
          title: '华清园',
          expand: true,
          children: this.huaqingCourse
        }
      ]
    }
  },
  mounted () {
    this.couponId = this.$route.params.couponId
    if (this.couponId !== 'add') {
      this.getCouponDetail()
    }
    this.getTitleList()
    this.getTitleList({ platform: 2 })
    this.getTitleList({ platform: 1 })
  },
  methods: {
    back () {
      this.$router.push({ path: `/coupon/coupon_list` })
    },
    getCouponDetail () {
      _getCouponDetail(this.couponId).then(res => {

      })
    },
    save () {
      // console.log(JSON.stringify(this.conditionCourse))
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          // 选择了种类之后对应的数值不能为空
          if (this.formData.type === 'voucher') {
            if (!this.formData.voucherValue) {
              this.$Message.error('请输入代金券面值')
              return false
            }
          } else if (this.formData.type === 'discount') {
            if (!this.formData.discountValue) {
              this.$Message.error('请输入折扣券折扣值')
              return false
            }
          } else {
            if (!this.formData.FullCouponValue || !this.formData.FullCouponDiscount) {
              this.$Message.error('请输入满折券面值和折扣值')
              return false
            }
          }
          // 选择了使用条件后对应的数值不能为空
          if (this.formData.condition.length === 1) {
            if (this.formData.condition.indexOf('满') !== -1) {
              if (!this.formData.conditionMoney) {
                this.$Message.error('请输入满多少元可使用')
              }
            } else if (this.formData.condition.indexOf('报名') !== -1) {
              if (!this.formData.conditionCourseNum) {
                this.$Message.error('请输入报名班课数量')
              }
            }
          } else if (this.formData.condition.length === 2) {
            switch (this.formData.condition.toString()) {
              case '满,报名':
                if (!this.formData.conditionMoney) {
                  this.$Message.error('请输入满多少元可用')
                } else {
                  if (!this.formData.conditionCourseNum) {
                    this.$Message.error('请输入报名班课数量')
                  }
                }
                break
              case '满,适用课程':
                if (!this.formData.conditionMoney) {
                  this.$Message.error('请输入满多少元可用')
                } else {
                  if (!this.conditionCourse || this.conditionCourse.length === 0) {
                    this.$Message.error('请选择适用课程')
                  }
                }
                break
              case '报名,适用课程':
                if (!this.formData.conditionCourseNum) {
                  this.$Message.error('请输入报名班课数量')
                } else {
                  if (!this.conditionCourse || this.conditionCourse.length === 0) {
                    this.$Message.error('请选择适用课程')
                  }
                }
            }
          } else {
            if (!this.formData.conditionMoney) {
              this.$Message.error('请输入满多少元可用')
              return false
            } else {
              if (!this.formData.conditionCourseNum) {
                this.$Message.error('请输入报名班课数量')
                return false
              } else {
                if (!this.conditionCourse || this.conditionCourse.length === 0) {
                  this.$Message.error('请选择适用课程')
                  return false
                }
              }
            }
          }
          // 构建接口数据
          let saveData = {}
          // 平台值
          if (this.formData.platformGroup.length === 1) {
            if (this.formData.platformGroup.indexOf('剑少五级') !== -1) {
              saveData['platform'] = 2
            }
            if (this.formData.platformGroup.indexOf('华清园') !== -1) {
              saveData['platform'] = 1
            }
          }
          // 种类值
          switch (this.formData.type) {
            case 'voucher':
              saveData['parValue'] = this.formData.voucherValue
              saveData['type'] = this.formData.type === 'voucher' ? 1 : this.formData.type === 'discount' ? 2 : 3
              break
            case 'discount':
              saveData['discountValue'] = this.formData.discountValue
              saveData['type'] = this.formData.type === 'voucher' ? 1 : this.formData.type === 'discount' ? 2 : 3
              break
            case 'FullCoupon':
              saveData['parValue'] = this.formData.FullCouponValue
              saveData['discountValue'] = this.formData.FullCouponDiscount
              saveData['type'] = this.formData.type === 'voucher' ? 1 : this.formData.type === 'discount' ? 2 : 3
          }
          saveData['name'] = this.formData.name
          if (this.formData.condition.indexOf('满') !== -1) {
            saveData['conditionMoney'] = this.formData.conditionMoney
          }
          if (this.formData.condition.indexOf('报名') !== -1) {
            saveData['conditionCourseNum'] = this.formData.conditionCourseNum
          }
          if (this.formData.condition.indexOf('适用课程') !== -1) {
            saveData['conditionCourse'] = JSON.stringify(this.conditionCourse)
          }
          saveData['startTime'] = dayjs(this.formData.startTime).format('YYYY-MM-DD HH:mm:ss')
          saveData['endTime'] = dayjs(this.formData.endTime).format('YYYY-MM-DD HH:mm:ss')
          console.log(saveData)
          // 保存优惠券
          if (this.couponId === 'add') {
            _saveCoupon(saveData).then(res => {
              this.$Message.success('新增优惠券成功')
              this.$router.push({ path: `/coupon/coupon_list` })
            })
          } else {
            // 更新优惠券
          }
        } else {
          this.$Message.error('请按要求填写内容')
        }
      })
    },
    deleteSelect (index) {
      this.conditionCourse.splice(index, 1)
    },
    checkChange (selectArr) {
      this.treeSelect = []
      selectArr.forEach(item => {
        if (item.title === '剑桥五级' || item.title === '华清园') {
          return false
        } else {
          this.treeSelect.push({ id: item.id, title: item.title, checked: true })
        }
      })
    },
    saveSelect () {
      // 构建需要显示的已选择课程的数组
      if (this.formData.condition.indexOf('适用课程') === -1) {
        this.$Message.error('请勾选适用课程后再选择课程')
        return false
      }
      if (this.searchTitle) {
        let id = this.courseTitles.filter(item => {
          return item.title === this.searchTitle
        })[0].id
        let searchObj = { id: id, title: this.searchTitle, checked: true }
        let HasSearchObj = this.conditionCourse.some(item => {
          return item.id === searchObj.id
        })
        if (!HasSearchObj) {
          this.conditionCourse.push(searchObj)
        } else {
          // this.$Message.warning('不能添加重复课程')
        }
      }
      if (this.treeSelect.length !== 0) {
        this.treeSelect.map(item => {
          let HasTreeObj = this.conditionCourse.some(item2 => {
            return item2.id === item.id
          })
          if (!HasTreeObj) {
            this.conditionCourse.push(item)
          } else {
            // this.$Message.warning('不能添加重复课程')
          }
        })
      }
      // console.log(this.conditionCourse)
    },
    getTitleList (data) {
      _getTitleList(data).then(res => {
        if (!data) {
          this.courseTitles = res
        } else {
          if (data.platform === 2) {
            this.levelfiveCourse = res.map(item => {
              return Object.assign({}, item, { checked: false })
            })
          } else if (data.platform === 1) {
            this.huaqingCourse = res.map(item => {
              return Object.assign({}, item, { checked: false })
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.ivu-menu-item > i {
    margin-right: 8px !important;
}
.layoutBox{
    padding-left:50px;
    padding-top:20px;
    padding-bottom:40px;
    background:#fff;
    .radioP{
      height:50px;
      .formLable{
        float:left;
        width:70px;
      }
      .valueInput{
        width:200px;
        float:left;
        margin-right:10px;
      }
      .inputLable{
        float:left;
        width:70px;
        text-align: right;
      }
    }
    .selectCard{
      width:500px;margin-bottom:20px;
      .tree{
        height:260px;overflow-y:scroll;
      }
      .cardTitle{
        height:34px;line-height:34px;
      }
    }
    .dateTime{
      width: 200px;margin-right:30px;
    }
    .btnBottom{
      padding-left:30px;
      margin-top:40px;
    }
}
</style>
