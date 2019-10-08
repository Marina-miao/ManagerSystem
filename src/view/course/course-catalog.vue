<template lang="pug">
  Layout.content
    Button(@click="add" type="primary" style="width:80px;") 添加目录
      div(slot="footer")
        Button(type="text" @click="cancel") 取消
        Button(type="primary" @click="save") 确定
    XTable(:isTableShow="isTableShow" v-model="tableData" :columns="columns" @on-delete="deleteCatalog" @on-edit="editCatalog")
    Modal(v-model="modalShow")
      Form(ref="formValidate" :rules="ruleValidate" :model="formData" :label-width="86" style="margin-top:50px;")
        FormItem(label="目录标题：" prop="name")
          Input(v-model="formData.name")
        FormItem(label="视频链接：" prop="resourceUrl")
          Input(v-model="formData.resourceUrl" style="width:300px;float:left;margin-right:10px;")
          Upload(:action="action" accept="video/*" :show-upload-list="false" :on-success="handleUploadSuccess" :before-upload="upload")
            Button(type="primary" :loading="uploading")
              span(v-if="!uploading") 上传视频
              span(v-else) 上传中
      div(slot="footer")
        Button(type="text" @click="cancel") 取消
        Button(type="primary" @click="save") 确定
</template>

<script>
import XTable from '_c/x-table'
import config from '@/config'
import {
  _getCatalogs,
  _saveCatalog,
  _deleteCatalog,
  _getCatalogDetail,
  _updateCatalog
} from '@/api/data.js'
export default {
  data () {
    return {
      modalShow: false,
      isTableShow: false,
      formData: {
        name: '',
        resourceUrl: ''
      },
      courseId: '',
      tableData: [],
      columns: [
        { title: '序号', type: 'index', width: 60 },
        { title: '标题', key: 'name' },
        { title: '视频链接', key: 'resourceUrl' },
        {
          title: '操作',
          key: 'handle',
          width: 400,
          buttons: [
            { name: 'edit', text: '编辑', type: 'primary' },
            'delete'
          ]
        }
      ],
      ruleValidate: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        resourceUrl: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      action: `${process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro}/upload/videos`,
      uploading: false,
      isHasId: false
    }
  },
  components: {
    XTable
  },
  mounted () {
    this.courseId = this.$route.query.courseId
    let isNewCatalog = this.$route.query.isNewCatalog
    if (isNewCatalog === 1) {
      this.isTableShow = false
    } else {
      this.isTableShow = true
    }
    this.getCatalogs()
  },
  methods: {
    editCatalog (params) {
      this.modalShow = true
      this.isHasId = params.row.id
      _getCatalogDetail(this.courseId, this.isHasId).then(res => {
        this.formData = res
      })
    },
    deleteCatalog (params) {
      let id = params.row.id
      _deleteCatalog(this.courseId, id).then(res => {
        this.$Message.success('删除目录成功')
        this.getCatalogs()
      })
    },
    upload () {
      this.uploading = true
    },
    handleUploadSuccess ({ data }) {
      this.$set(this.formData, 'resourceUrl', data.fileUrl)
      this.uploading = false
    },
    getCatalogs () {
      _getCatalogs(this.courseId).then(res => {
        this.tableData = res
      })
    },
    add () {
      this.formData = {}
      this.modalShow = true
    },
    cancel () {
      this.modalShow = false
    },
    save () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          if (!this.isHasId) {
            // 添加新目录
            _saveCatalog(this.formData, this.courseId).then(res => {
              this.$Message.success('添加目录成功')
              this.isTableShow = true
              this.modalShow = false
              this.getCatalogs()
            })
          } else {
            // 更新目录
            _updateCatalog(this.formData, this.courseId, this.isHasId).then(res => {
              this.$Message.success('编辑目录成功')
              this.modalShow = false
              this.isHasId = false
              this.getCatalogs()
            })
          }
        } else {
          this.modalShow = true
          this.$Message.error('请根据规则填写内容')
        }
      })
    }
  }
}
</script>
<style>
</style>
