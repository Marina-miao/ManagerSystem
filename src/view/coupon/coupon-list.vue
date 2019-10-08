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
            InputNumber.inputNum(v-model="formData.parValue" placeholder="" :min="0" class="valueInput")
          p(class="radioP")
            Radio(label="discount" class="formLable") 折扣券
            span(class="inputLable") 折扣值：
            InputNumber.inputNum(v-model="formData.parValue" placeholder="" :min="0" class="valueInput")
          p(class="radioP")
            Radio(label="FullCoupon" class="formLable") 满折券
            span(class="inputLable") 面值：
            InputNumber.inputNum(v-model="formData.parValue" placeholder="" :min="0" class="valueInput")
            span(class="inputLable") 折扣值：
            InputNumber.inputNum(v-model="formData.parValue" placeholder="" :min="0" class="valueInput")
      FormItem(label="使用条件：" prop="condition" style="margin-bottom:0px;")
        CheckboxGroup(v-model="formData.condition")
          p(class="radioP")
            Checkbox(label="满" class="formLable")
            InputNumber.inputNum(v-model="formData.parValue" placeholder="" :min="0" class="valueInput")
            span 元可使用
          p(class="radioP")
            Checkbox(label="报名" class="formLable")
            InputNumber.inputNum(v-model="formData.parValue" placeholder="" :min="0" class="valueInput")
            span  个课程班
          p(class="radioP")
            Checkbox(label="适用课程" class="formLable")
          div
            p(v-for="item in formData.conditionCourse")
        Card(style="width:500px;margin-bottom:20px;" v-if="conditionCourse.length != 0")
          p(slot="title" style="height:34px;line-height:34px;") 已选择的适用课程
          p(v-for="(item, index) in conditionCourse")
            span {{item.title}}
            Button(type="primary" size="small" style="float:right" @click="deleteSelect(index)") 删除
        Card(style="width:500px;")
          p(slot="title" style="height:34px;line-height:34px;") 请搜索或选择课程
            Button(type="primary" style="float:right;" @click="saveSelect") 确定
          p
            Select(v-model="searchTitle" filterable style="width:100%;" clearable)
              Option(v-for="item in courseTitles" :value="item.title" :key="item.title") {{ item.title }}
          Tree(:data="treeData" show-checkbox @on-check-change="checkChange" style="height:260px;overflow-y:scroll;")
</template>

<script>
// import dayjs from 'dayjs'
import {
  _getTitleList
} from '@/api/data.js'
export default {
  data () {
    return {
      formData: {
        parValue: null
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
          { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
        ],
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: 'Please select gender', trigger: 'change' }
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
    this.getTitleList()
    this.getTitleList({ platform: 2 })
    this.getTitleList({ platform: 1 })
  },
  methods: {
    deleteSelect (index) {
      this.conditionCourse.splice(index, 1)
    },
    checkChange (selectArr) {
      this.treeSelect = []
      selectArr.forEach(item => {
        if (item.title === '剑桥五级' || item.title === '华清园') {
          return false
        } else {
          this.treeSelect.push({ id: item.id, title: item.title })
        }
      })
    },
    saveSelect () {
      // 重置一下勾选框
      this.getTitleList()
      this.getTitleList({ platform: 2 })
      this.getTitleList({ platform: 1 })
      // 构建需要显示的已选择课程的数组
      this.levelfiveCourse.forEach(item => {
        this.$set(item, 'checked', false)
      })
      this.huaqingCourse.forEach(item => {
        this.$set(item, 'checked', false)
      })
      // this.conditionCourse = []
      if (this.searchTitle) {
        let id = this.courseTitles.filter(item => {
          return item.title === this.searchTitle
        })[0].id
        let searchObj = { id: id, title: this.searchTitle }
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
}
</style>
