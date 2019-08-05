<template lang="pug">
  Card.campushandle
    h3(style="height: 40px") 新增/编辑校区
    Form(ref="form" :model="form" :rules="rules" :label-width="120" style="width: 960")
      FormItem(label="校区名称" prop="title")
        Input(v-model="form.title")
      FormItem(label="所在省市" prop="dic")
        Select(v-model="form.dic" style="width: 40%" :disabled="id === 'add' ? false : true")
          Option(v-for="(v,k) of searchData" :key="k" :value="v.value") {{ v.label }}
        Select(v-model="form.dic" style="width: 40%" :disabled="id === 'add' ? false : true")
          Option(v-for="(v,k) of searchData" :key="k" :value="v.value") {{ v.label }}
      FormItem(label="校区运营类型" prop="dic")
        Select(v-model="form.dic" style="width: 40%" :disabled="id === 'add' ? false : true")
          Option(v-for="(v,k) of searchData" :key="k" :value="v.value") {{ v.label }}
      FormItem(label="校区地址" prop="title")
        Input(v-model="form.title")
      FormItem(label="校区联系人" prop="title")
        Input(v-model="form.title")
      FormItem(label="联系方式" prop="title")
        Input(v-model="form.title")
      FormItem
        Button(type="primary" style="margin-right: 60px" @click="handleCancel") 取消
        Button(type="primary" @click="handleSave") 保存
</template>

<script>
  import { mapMutations } from 'vuex'
  import config from '@/config'
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import { findDictByCodes, selectDocForId, addOrUpdateDocDetail } from '@/api/data'
  export default {
    name: 'campushandle',
    components: { VueUeditorWrap },
    props: ['id'],
    data () {
      return {
        action: `${process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro}/file/uploadPC`,
        actionUp: `${process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro}/file/uploadFiles`,
        config: config.ueditor,
        searchData: '',
        form: {},
        rules: {
          dic: [{ required: true, message: '此项不能为空', trigger: 'blur', type: 'number' }],
          title: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
          url: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
          author: [{ required: true, message: '此项不能为空', trigger: 'blur' }]
        }
      }
    },
    mounted () {
      this.getSelectData()
      this.id !== 'add' && this.fetchEditData()
    },
    methods: {
      ...mapMutations(['closeTag']),
      fetchEditData () {
        selectDocForId(this.id).then(data => {
          this.form = { ...data }
          this.form.dic = Number(this.form.dic)
        })
      },
      getSelectData () {
        findDictByCodes().then(data => {
          this.searchData = data.sys_docfl
        })
      },
      handleUpload ({ data }) {
        this.$set(this.form, 'pic', data.url)
        // this.$refs['form'].validateField('pic')
      },
      handleUploadDoc ({ sysCode, data }, fileList) {
        if (sysCode !== 1000) return this.$Message.error('上传失败')
        this.$set(this.form, 'url', fileList.response.data[0].url)
        this.$set(this.form, 'docSize', fileList.response.data[0].docSize)
        this.$set(this.form, 'fileName', fileList.response.data[0].name)
      },
      handleSave () {
        this.$refs['form'].validate(valid => {
          if (valid) {
            addOrUpdateDocDetail(this.form).then(res => {
              this.$Message.success('保存成功')
              this.handleCancel()
            })
          }
        })
      },
      handleCancel () {
        this.closeTag(this.$route)
      }
    }
  }
</script>

<style scoped>

</style>

