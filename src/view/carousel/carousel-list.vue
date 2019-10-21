<template lang="pug">
  Layout.content
    XTable(ref="table"
    :isTableShow="isTableShow"
    v-model="tableData"
    :columns="columns"
    :search="search"
    :page="page"
    @on-search="handleSearch"
    @on-edit="editPicture"
    @on-delete="deletePicture")
      Button(type="primary" style="margin-left:30px;" slot="btn" @click="addPicture" :disabled="isDisabled") 新增轮播图
    Modal(v-model="modalShow")
      p(slot="header")
        span 添加轮播图
      Form.formBox(ref="formInline" :model="pictureData" :rules="ruleValidate" label-position="top" style="padding-left:20px;padding-top:20px;")
        FormItem(label="平台：" prop="platformGroup")
          CheckboxGroup(v-model="pictureData.platformGroup")
            Checkbox(label="剑少五级" style="margin-right:20px;")
            Checkbox(label="华清园")
        FormItem(label="页面：" prop="name" class="formItem")
          RadioGroup(v-model="pictureData.name")
            Radio(label="首页" style="margin-right:30px;") 首页
            Radio(label="课程列表") 课程列表
        FormItem(label="图片地址：" prop="url" class="formItem")
          Input(v-model="pictureData.url" style="width:360px;float:left;margin-right:10px;")
          Upload(:action="action" accept="image/*" :show-upload-list="false" :on-success="handleUploadSuccess" :before-upload="upload")
            Button(type="primary" :loading="uploading")
              span(v-if="!uploading") 上传图片
              span(v-else) 上传中
        FormItem(label="链接地址：" prop="link" class="formItem")
          Input(v-model="pictureData.link" style="width:450px;")
      div(slot="footer")
        Button(type="text" @click="cancel") 取消
        Button(type="primary" @click="save") 确定
</template>
<script>
import XTable from '_c/x-table'
import {
  _getPictureList,
  _deletePicture,
  _getPictureDetail,
  _savePicture,
  _updatePicture
} from '@/api/data.js'
import config from '@/config'
export default {
  data () {
    return {
      isTableShow: true, // 表格显示隐藏
      modalShow: false,
      isDisabled: false,
      pictureId: '',
      formData: {},
      pictureData: {
        platformGroup: [],
        name: '',
        url: '',
        link: ''
      },
      uploading: false,
      columns: [
        { title: '平台', key: 'platform', width: 220 },
        { title: '页面', key: 'name', width: 150 },
        {
          title: '图片',
          key: 'url',
          render: (h, params) => h('img', {
            style: {
              height: '100px',
              marginTop: '6px'
            },
            attrs: {
              src: params.row.url
            }
          })
        },
        { title: '链接地址', key: 'link' },
        {
          title: '操作',
          key: 'handle',
          width: 300,
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
      ],
      tableData: [],
      page: {
        current: 1,
        total: 0,
        'page-size': 10
      },
      ruleValidate: {
        platformGroup: [
          { required: true, type: 'array', min: 1, message: '必须至少选择一个平台', trigger: 'change' },
          { type: 'array', max: 1, message: '请单个平台编辑', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请选择页面', trigger: 'change' }
        ],
        url: [
          { required: true, message: '图片地址不能为空', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '链接地址不能为空', trigger: 'blur' }
        ]
      },
      action: `${process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro}/upload/images`
    }
  },
  computed: {
    search () {
      return [
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
    this.getPictureList()
  },
  methods: {
    cancel () {
      this.modalShow = false
    },
    upload () {
      this.uploading = true
    },
    editPicture (row) {
      this.modalShow = true
      this.pictureId = row.id
      _getPictureDetail(this.pictureId).then(res => {
        switch (res.platform) {
          case 2:
            this.pictureData.platformGroup = ['剑少五级']
            break
          case 1:
            this.pictureData.platformGroup = ['华清园']
            break
        }
        this.pictureData.name = res.name
        this.pictureData.url = res.url
        this.pictureData.link = res.link
      })
    },
    deletePicture (params) {
      _deletePicture(params.row.id).then(res => {
        this.$Message.success('删除成功')
        this.getPictureList()
      })
    },
    handleUploadSuccess (res) {
      this.$set(this.pictureData, 'url', res.data.fileUrl)
      this.uploading = false
    },
    addPicture () {
      this.pictureData = {}
      this.pictureId = ''
      this.modalShow = true
    },
    save () {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          let saveData = {}
          let platform = this.pictureData.platformGroup.toString() === '剑少五级' ? 2 : this.pictureData.platformGroup.toString() === '华清园' ? 1 : 0
          let type = this.pictureData.name === '首页' ? 0 : 1
          let { name, link, url } = this.pictureData
          saveData = { platform, type, name, link, url }
          if (!this.pictureId) {
            // 新增轮播图
            _savePicture(saveData).then(res => {
              this.$Message.success('新增成功')
              this.modalShow = false
              this.getPictureList()
            })
          } else {
            // 更新轮播图
            _updatePicture(saveData, this.pictureId).then(res => {
              this.$Message.success('编辑成功')
              this.modalShow = false
              this.getPictureList()
            })
          }
        } else {
          // this.$Message.error('Fail!')
        }
      })
    },
    getPictureList () {
      _getPictureList({ ...this.formData, pageNum: (this.page.current - 1) * this.page['page-size'], pageSize: this.page['page-size'] }).then(res => {
        this.page['total'] = res.total
        if (this.page['total'] > 6) {
          this.isDisabled = true
        }
        this.tableData = res.data.map(item => {
          return {
            id: item.id,
            platform: item.platform === 2 ? '剑少五级' : '华清园',
            name: item.name,
            url: item.url,
            link: item.link
          }
        })
      })
    },
    handleSearch (form) {
      this.formData = form
      this.getPictureList()
    }
  }
}
</script>
<style lang="less">
.content{
    background:#fff;
    padding:18px 18px 30px 18px;
    .formItem{
      margin-top:30px;
    }
  }
</style>
