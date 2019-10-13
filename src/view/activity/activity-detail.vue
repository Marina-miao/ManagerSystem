<template lang="pug">
  Layout.content
    Form.formBox(ref="formInline" :model="formData" :rules="ruleValidate" :label-width="100")
      FormItem(label="平台：" prop="platformGroup")
        CheckboxGroup(v-model="formData.platformGroup" @on-change="platChange")
          Checkbox(label="剑少五级")
          Checkbox(label="华清园")
      FormItem(label="活动类型：" prop="radioType")
        RadioGroup(v-model="formData.radioType")
          Radio(label="普通活动") 普通活动
          Radio(label="杯赛" :disabled="isDisabled") 杯赛
      FormItem(label="活动场次：")
        Button(type="primary" @click="addScene") 添加
        Card(v-if="sceneData.length != 0" style="width: 400px;margin-top:20px;")
          p(slot="title" class="cardTitle") 活动场次
          p(v-for="(value, index) in sceneData")
            span {{value}}
            Button(type="primary" size="small" style="float:right" @click="deleteScene(index)") 删除
            Button(type="primary" size="small" style="float:right;margin-right:10px;" @click="editScene(index)") 编辑
    Modal(v-model="sceneModal" ref="")
      p(style="margin-top:30px;margin-bottom:15px;") 活动场次：
      p
        Input(v-model="sceneInput")
      div(slot="footer")
        Button(type="text" @click="cancel") 取消
        Button(type="primary" @click="saveScene") 确定

</template>
<script>
import {

} from '@/api/data.js'
export default {
  data () {
    return {
      isDisabled: false,
      sceneModal: false,
      sceneInput: '',
      sceneData: [],
      formData: {
        platformGroup: []
      },
      ruleValidate: {
        platformGroup: [
          { required: true, type: 'array', min: 1, message: '必须至少选择一个平台', trigger: 'change' },
          { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
        ]
        // radioType: [
        //   { required: true, message: 'Please select gender', trigger: 'change' }
        // ]
      }
    }
  },
  computed: {

  },
  components: {

  },
  mounted () {

  },
  methods: {
    saveScene () {
      this.sceneData.push(this.sceneInput)
      this.sceneModal = false
    },
    cancel () {
      this.sceneModal = false
    },
    addScene () {
      this.sceneModal = true
    },
    platChange () {
      if (this.formData.platformGroup.indexOf('剑少五级') !== -1) {
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
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
