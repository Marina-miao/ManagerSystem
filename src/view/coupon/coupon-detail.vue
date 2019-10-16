<template lang="pug">
  Layout.layoutBox
    Form.formBox(ref="formInline" :model="formData" :rules="ruleValidate" :label-width="100")
      FormItem(label="平台：" prop="platformGroup" class="formItem")
        CheckboxGroup(v-model="formData.platformGroup")
          Checkbox(label="剑少五级")
          Checkbox(label="华清园")
      FormItem(label="优惠券名称：" prop="name" class="formItem")
        Input(v-model="formData.name" placeholder="" style="width:630px;")
      FormItem(label="种类：" prop="type" class="formItem")
        RadioGroup(v-model="formData.type" @on-change="radioChange")
          p(class="radioP")
            Radio(label="voucher" class="formLable") 代金券
            span(class="inputLable") 面值：
            InputNumber.inputNum(v-model="formData.voucherValue" placeholder="" :min="0" class="valueInput" :disabled="disableObj.voucherValue")
          p(class="radioP")
            Radio(label="discount" class="formLable") 折扣券
            span(class="inputLable") 折扣值：
            InputNumber.inputNum(v-model="formData.discountValue" placeholder="" :min="0" class="valueInput" :disabled="disableObj.discountValue")
          p(class="radioP")
            Radio(label="FullCoupon" class="formLable") 满折券
            span(class="inputLable") 面值：
            InputNumber.inputNum(v-model="formData.FullCouponValue" placeholder="" :min="0" class="valueInput" :disabled="disableObj.FullCouponValue")
            span(class="inputLable") 折扣值：
            InputNumber.inputNum(v-model="formData.FullCouponDiscount" placeholder="" :min="0" class="valueInput" :disabled="disableObj.FullCouponDiscount")
      FormItem(label="使用条件：" prop="condition" style="margin-bottom:0px;" class="formItem")
        CheckboxGroup(v-model="formData.condition" @on-change="selectChange")
          p(class="radioP")
            Checkbox(label="满" class="formLable")
            InputNumber.inputNum(v-model="formData.conditionMoney" placeholder="" :min="0" class="valueInput" :disabled="disableObj.conditionMoney")
            span 元可使用
          p(class="radioP")
            Checkbox(label="报名" class="formLable")
            InputNumber.inputNum(v-model="formData.conditionCourseNum" placeholder="" :min="0" class="valueInput" :disabled="disableObj.conditionCourseNum")
            span  个课程班
          p(class="radioP")
            Checkbox(label="适用课程" class="formLable")
        Card(class="selectCard" style="" v-if="conditionCourse.length != 0")
          p(slot="title" class="cardTitle") 已选择的适用课程
          p(v-for="(item, index) in conditionCourse")
            span {{item.title}}
            Button(type="primary" size="small" style="float:right" @click="deleteSelect(index)") 删除
        Card(class="selectCard" v-show="selectCardShow")
          p(slot="title"  class="cardTitle") 请搜索或选择课程
            Button(type="primary" style="float:right;" @click="saveSelect") 确定
          p
            Select(v-model="searchTitle" filterable style="width:100%;" clearable)
              Option(v-for="item in courseTitles" :value="item.title" :key="item.title") {{ item.title }}
          Tree(:data="treeData" show-checkbox @on-check-change="checkChange" class="tree")
      FormItem(label="有效时间：" prop="startTime" class="formItem")
        DatePicker(type="datetime" class="dateTime" v-model="formData.startTime" placeholder="开始时间")
      FormItem(label="" prop="endTime" style="float:left;")
        DatePicker(type="datetime" class="dateTime" v-model="formData.endTime" placeholder="结束时间")
    p(class="btnBottom")
      Button(style="margin-right:20px;" @click="back") 取消
      Button(type="primary" @click="save") 保存
</template>

<script>
import dayjs from 'dayjs'
import {
  _getTitleList,
  _saveCoupon,
  _getCouponDetail,
  _updateCoupon
} from '@/api/data.js'
export default {
  data () {
    return {
      couponId: '',
      selectCardShow: false, // 控制选择课程的卡片是否显示
      disableObj: {
        voucherValue: true,
        discountValue: true,
        FullCouponValue: true,
        FullCouponDiscount: true,
        conditionMoney: true,
        conditionCourseNum: true

      }, // 控制输入框是否可输入
      formData: {
        platformGroup: [],
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
        ],
        condition: [
          { required: true, type: 'array', min: 1, message: '至少要选择一个使用条件', trigger: 'change' },
          { type: 'array', max: 3, message: 'Choose two hobbies at best', trigger: 'change' }
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
    selectChange () {
      // 如果不选择某个使用条件时，该使用条件对应的值清空
      if (this.formData.condition.indexOf('满') !== -1) {
        this.disableObj.conditionMoney = false
      } else {
        this.formData.conditionMoney = null
        this.disableObj.conditionMoney = true
      }
      if (this.formData.condition.indexOf('报名') !== -1) {
        this.disableObj.conditionCourseNum = false
      } else {
        this.formData.conditionCourseNum = null
        this.disableObj.conditionCourseNum = true
      }
      if (this.formData.condition.indexOf('适用课程') !== -1) {
        this.selectCardShow = true
      } else {
        this.selectCardShow = false
      }
    },
    radioChange () {
      // 只有选中的当前种类的输入框可以编辑，其他种类的输入框不能编辑且清空输入框
      for (let key in this.disableObj) {
        if (key === 'voucherValue' || key === 'discountValue' || key === 'FullCouponValue' || key === 'FullCouponDiscount') {
          this.disableObj[key] = true
        }
      }
      this.formData.voucherValue = null
      this.formData.discountValue = null
      this.formData.FullCouponValue = null
      this.formData.FullCouponDiscount = null
      switch (this.formData.type) {
        case 'voucher' :
          this.disableObj.voucherValue = false
          break
        case 'discount' :
          this.disableObj.discountValue = false
          break
        case 'FullCoupon' :
          this.disableObj.FullCouponValue = false
          this.disableObj.FullCouponDiscount = false
          break
      }
    },
    back () {
      this.$router.push({ path: `/coupon/coupon_list` })
    },
    getCouponDetail () {
      _getCouponDetail(this.couponId).then(res => {
        this.formData.platformGroup = (res.platform === 1 ? ['华清园'] : res.platform === 2 ? ['剑少五级'] : ['华清园 剑少五级'])
        this.formData.name = res.name
        // 优惠券种类赋值
        switch (res.type) {
          case 1:
            this.formData.type = 'voucher'
            this.disableObj.voucherValue = false
            this.formData.voucherValue = res.parValue
            break
          case 2:
            this.formData.type = 'discount'
            this.disableObj.discountValue = false
            this.formData.discountValue = res.discountValue
            break
          case 3:
            this.formData.type = 'FullCoupon'
            this.disableObj.FullCouponValue = false
            this.disableObj.FullCouponDiscount = false
            this.formData.FullCouponValue = res.parValue
            this.formData.FullCouponDiscount = res.discountValue
            break
        }
        // 使用条件赋值
        if (res.conditionMoney) {
          this.formData.condition.push('满')
          this.disableObj.conditionMoney = false
          this.formData.conditionMoney = res.conditionMoney
        }
        if (res.conditionCourseNum) {
          this.formData.condition.push('报名')
          this.disableObj.conditionCourseNum = false
          this.formData.conditionCourseNum = res.conditionCourseNum
        }
        let conditionCourse = JSON.parse(res.conditionCourse)
        if (conditionCourse && conditionCourse.length) {
          this.formData.condition.push('适用课程')
          this.selectCardShow = true
          this.conditionCourse = conditionCourse
        }
        this.formData.startTime = res.startTime
        this.formData.endTime = res.endTime
      })
    },
    save () {
      // console.log(JSON.stringify(this.conditionCourse))
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          // 选择了种类之后对应的数值不能为空
          if (this.formData.type === 'voucher') {
            if (!this.formData.voucherValue) {
              this.$Message.error('请输入面值')
              return false
            }
          } else if (this.formData.type === 'discount') {
            if (!this.formData.discountValue) {
              this.$Message.error('请输入折扣值')
              return false
            } else {
              if (this.formData.discountValue < 1 || this.formData.discountValue > 10) {
                this.$Message.error('请输入1到10的折扣值')
                return false
              }
            }
          } else {
            if (!this.formData.FullCouponValue) {
              this.$Message.error('请输入面值')
              return false
            } else {
              if (!this.formData.FullCouponDiscount) {
                this.$Message.error('请输入折扣值')
                return false
              } else {
                if (this.formData.FullCouponDiscount < 1 || this.formData.FullCouponDiscount > 10) {
                  this.$Message.error('请输入1到10的折扣值')
                  return false
                }
              }
            }
          }
          // 选择了使用条件后对应的数值不能为空
          switch (this.formData.condition.length) {
            case 1:
              if (this.formData.condition.indexOf('满') !== -1) {
                if (!this.formData.conditionMoney) {
                  this.$Message.error('请输入满多少元可使用')
                  return false
                }
              } else if (this.formData.condition.indexOf('报名') !== -1) {
                if (!this.formData.conditionCourseNum) {
                  this.$Message.error('请输入报名班课数量')
                  return false
                }
              } else {
                if (!this.conditionCourse || !this.conditionCourse.length) {
                  this.$Message.error('请选择适用课程')
                  return false
                }
              }
              break
            case 2:
              if (this.formData.condition.indexOf('满') !== -1) {
                if (!this.formData.conditionMoney) {
                  this.$Message.error('请输入满多少元可使用')
                  return false
                } else if (this.formData.condition.indexOf('报名') !== -1) {
                  if (!this.formData.conditionCourseNum) {
                    this.$Message.error('请输入报名班课数量')
                    return false
                  }
                } else if (this.formData.condition.indexOf('适用课程') !== -1) {
                  if (!this.conditionCourse || !this.conditionCourse.length) {
                    this.$Message.error('请选择适用课程')
                    return false
                  }
                }
              } else if (this.formData.condition.indexOf('报名') !== -1) {
                if (!this.formData.conditionCourseNum) {
                  this.$Message.error('请输入报名班课数量')
                  return false
                } else {
                  if (!this.conditionCourse || !this.conditionCourse.length) {
                    this.$Message.error('请选择适用课程')
                    return false
                  }
                }
              }
              break
            case 3:
              if (!this.formData.conditionMoney) {
                this.$Message.error('请输入满多少元可使用')
                return false
              } else if (!this.formData.conditionCourseNum) {
                this.$Message.error('请输入报名班课数量')
                return false
              } else {
                if (!this.conditionCourse || !this.conditionCourse.length) {
                  this.$Message.error('请选择适用课程')
                  return false
                }
              }
          }
          // 日期开始时间不能小于结束时间
          let startTime = this.formData.startTime.getTime()
          let endTime = this.formData.endTime.getTime()
          if (endTime <= startTime) {
            this.$Message.error('开始时间不能小于结束时间')
            return false
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
          // 使用条件的值
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
          // console.log(saveData)
          // 保存优惠券
          if (this.couponId === 'add') {
            _saveCoupon(saveData).then(res => {
              this.$Message.success('新增优惠券成功')
              this.$router.push({ path: `/coupon/coupon_list` })
            })
          } else {
            // 更新优惠券
            _updateCoupon(saveData, this.couponId).then(res => {
              this.$Message.success('编辑优惠券成功')
              this.$router.push({ path: `/coupon/coupon_list` })
            })
          }
        } else {
          // this.$Message.error('请按要求填写内容')
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
          this.$Message.warning('该课程已经添加')
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
.ivu-message{
  font-size:18px;
  Icon {
    font-size: 18px;
  }
}
.layoutBox{
    padding-left:50px;
    padding-bottom:40px;
    background:#fff;
    .formItem{
      margin-top:40px;
    }
    .radioP{
      height:50px;
      .formLable{
        float:left;
        width:70px;
      }
      .valueInput{
        width:200px;
        float:left;
        margin-right:30px;
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
