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
        FormItem(label="页面：" prop="page" class="formItem")
          RadioGroup(v-model="pictureData.page")
            Radio(label="首页" style="margin-right:30px;") 首页
            Radio(label="课程列表") 课程列表
        FormItem(label="图片地址：" prop="imgUrl" class="formItem")
          Input(v-model="pictureData.imgUrl" style="width:360px;float:left;margin-right:10px;")
          Upload(:action="action" accept="image/*" :show-upload-list="false" :on-success="handleUploadSuccess")
            Button(type="primary" :loading="uploading")
              span(v-if="!uploading") 上传图片
              span(v-else) 上传中
        FormItem(label="链接地址：" prop="linkUrl" class="formItem")
          Input(v-model="pictureData.linkUrl" style="width:450px;")
      div(slot="footer")
        Button(type="primary" @click="save") 确定
</template>
<script>
import XTable from '_c/x-table'
import {
  _getPictureList,
  _deletePicture,
  _getPictureDetail
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
      pictureData: {},
      uploading: false,
      columns: [
        { title: '平台', key: 'platform' },
        { title: '页面', key: 'name', width: '400px' },
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
        { title: '链接地址', key: 'url' },
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
          { type: 'array', max: 2, message: '', trigger: 'change' }
        ],
        page: [
          { required: true, message: '请选择页面', trigger: 'change' }
        ],
        imgUrl: [
          { required: true, message: '图片地址不能为空', trigger: 'blur' }
        ],
        linkUrl: [
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
    editPicture (row) {
      this.modalShow = true
      this.pictureId = row.id
      _getPictureDetail(this.pictureId).then(res => {
        this.pictureData.platformGroup = res.platform === 2 ? ['剑少五级'] : res.platform === 1 ? ['华清园 '] : ['华清园 剑少']
        this.pictureData.page = res.name
        this.pictureData.page = res.imgUrl
        this.pictureData.page = res.linkUrl
      })
    },
    deletePicture (params) {
      _deletePicture(params.row.id).then(res => {
        this.$Message.success('删除成功')
        this.getPictureList()
      })
    },
    handleUploadSuccess (res) {
      this.$set(this.pictureData, 'imgUrl', res.data.fileUrl)
    },
    addPicture () {
      this.modalShow = true
    },
    save () {
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          if (!this.pictureId) {
            // 新增轮播图
          } else {
            // 更新轮播图
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
            platform: item.platform === 2 ? '剑少五级' : item.platform === 1 ? '华清园' : '华清园 剑少五级',
            name: item.name,
            url: item.url
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
  .formItem{
    margin-top:30px;
  }
</style>
