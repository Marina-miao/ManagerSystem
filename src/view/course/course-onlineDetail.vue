<template lang="pug">
Layout.layoutBox
    Form.formBox(ref="formInline" :model="formData" :rules="ruleValidate" :label-width="120")
      FormItem(label="平台：" prop="platformGroup")
        CheckboxGroup(v-model="formData.platformGroup")
          Checkbox(label="剑少五级")
          Checkbox(label="华清园")
      FormItem(label="课程分类：" prop="classifyGroup")
        CheckboxGroup(v-model="formData.classifyGroup")
          Checkbox(label="学段")
          Select.selectWidth(v-model="period" clearable)
              Option(v-for="(item, index) in periodList" :value="item.name" :key="item.name") {{item.name}}
          span.blueFont(type="text" @click="editPeriod") 编辑分类
          p.lineFeed
          Checkbox(label="项目")
          Select.selectWidth(v-model="project" style="margin-right:30px;" @on-change="projectChange(project)" clearable)
              Option(v-for="item in projectOptions" :value="item.name" :key="item.name") {{item.name}}
          Select.selectWidth(v-model="projectSub" clearable)
              Option(v-for="(item, index) in projectSubList" :value="item.name" :key="item.name") {{item.name}}
          span.blueFont(type="text" @click="editProject") 编辑分类
      FormItem(label="课程标题：" prop="title")
        Input(v-model="formData.title" placeholder="")
      FormItem(label="价格：" prop="price")
        InputNumber.inputNum(v-model="formData.price" placeholder="" :min="0")
      FormItem(label="封面：" prop="coverUrl")
        Upload(:action="coverAction" accept="image/*" :show-upload-list="false" :on-success="handleUpload")
          img(v-if="formData.coverUrl" :src="formData.coverUrl" style="height: 120px; cursor: pointer")
          Button(v-else type="dashed" style="width: 180px; line-height: 110px")
            Icon(type="ios-cloud-upload" size="30")
      FormItem(label="宣传视频（选填）：")
        UploadVideo(:action="videoAction" :videoUrl.sync="formData.promotionalUrl")
      FormItem(label="简介：" prop="introduce")
        VueUeditorWrap(v-model="formData.introduce" :config="config")
      FormItem(label="已学过人数：" prop="studyNum")
        InputNumber.inputNum(v-model="formData.studyNum" placeholder="" :min="10")
      FormItem.bottom
        Button.backBtn(type="primary" @click="goList") 返回
        Button(type="primary" @click="publish") 下一步
    //- 学段弹出框
    Modal(v-model="periodModal" width="360")
      p(slot="header")
        span 编辑学段
      div.rowBox
        Row.rowBottom(v-for="(item, index) in periodList" :key="index")
          Col(span="16") {{item.name}}
          Col(span="8")
            span.blueFont(type="text" @click="addPeriod(item)") 编辑
            span.blueFont(type="text" @click="deletePeriod(item.id)") 删除
      div(slot="footer")
        span.addText(@click="addPeriod(null)") 添加分类
        Button(type="primary" @click="periodOk") 确定
    //- 添加学段分类弹出框
    Modal(v-model="addPeriodModal")
      div.inputBox
        span.inputLeft 分类名称：
        Input.inputValue(v-model="periodName" placeholder="")
      div(slot="footer")
        Button(type="text" @click="addPeriodCancel") 取消
        Button(type="primary" @click="addPeriodOk") 确定
    //- 项目弹出框
    Modal(v-model="projectModal")
      p(slot="header")
        span 编辑项目
      div(style="max-height:600px;overflow-y:scroll;overflow-x:hidden")
        Tree(:data="treeArray" :render="renderContent")
      div(slot="footer")
        span.addText(@click="addParent()") 添加分类
        Button(type="primary" @click="editProjectOver") 确定
    //- 添加编辑子类弹出框
    Modal(v-model="addSubModal")
      div.inputBox
        span.inputLeft 子类名称：
        Input.inputValue(v-model="subName" placeholder="")
      div(slot="footer")
        Button(type="text" @click="") 取消
        Button(type="primary" @click="saveAddSub") 确定
    //- 添加编辑父类弹出框
    Modal(v-model="addParentModal")
      div.inputBox
        span.inputLeft 分类名称：
        Input.inputValue(v-model="parentName" placeholder="")
      div(slot="footer")
        Button(type="text" @click="") 取消
        Button(type="primary" @click="saveAddParent") 确定
    Modal(v-model="publishModal" ref="publishDom")
      p(slot="header")
        span 确认发布
      div 确定保存课程介绍信息并进入下一步吗？
      div(slot="footer")
        Button(type="primary" @click="publishLast") 确定
</template>

<script>
import {
  _getCourseDetail,
  _getPeriodList,
  _deletePeriod,
  _savePeriod,
  _saveCurrentPeriod,
  _getProject,
  _saveAdd,
  _update,
  _delete,
  _addOnlineCourse,
  _updateOnlineCourse
} from '@/api/data'
import config from '@/config'
import VueUeditorWrap from 'vue-ueditor-wrap'
import UploadVideo from '_c/uploadVideo'
export default {
  name: 'courseDetail',
  data () {
    return {
      config: config.ueditor,
      courseId: 0,
      formData: {
        platformGroup: [],
        classifyGroup: [],
        price: null,
        studyNum: null
      },
      coverAction: `${process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro}/upload/images`,
      videoAction: `${process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro}/upload/videos`,
      periodList: [],
      projectList: [],
      projectOptions: [],
      period: '',
      project: '',
      periodModal: false,
      projectModal: false,
      addPeriodModal: false,
      periodName: '',
      periodId: 0,
      projectSub: '',
      projectSubList: [],
      addSubModal: false,
      subName: '',
      treeArray: [],
      parentId: '',
      childId: '',
      addParentModal: false,
      parentName: '',
      pid: 0,
      TimetableModal: false,
      ruleValidate: {
        platformGroup: [
          { required: true, type: 'array', min: 1, message: '必须至少选择一个平台', trigger: 'change' },
          { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
        ],
        classifyGroup: [
          { required: true, type: 'array', min: 1, message: '学段和项目必须勾选一项', trigger: 'change' },
          { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
        ],
        title: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        coverUrl: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        studyNum: [
          { required: true, type: 'number', message: '请输入数字', trigger: 'blur' }
        ]
      },
      publishModal: false,
      saveData: {} // 需要发布更新的全部数据
    }
  },
  components: {
    UploadVideo,
    VueUeditorWrap
  },
  mounted () {
    // // 查询所有学段
    // this.getPeriod()
    // // 配置树选择框和树形菜单
    // this.getProjectSelect()
    Promise.all([this.getPeriod(), this.getProjectSelect()]).then(res => {
      this.courseId = this.$route.params.courseId
      if (this.courseId !== 'add') {
        this.getDetail()
      }
    })
  },
  methods: {
    goList () {
      this.$router.push({ path: `/course/course_list` })
    },
    nextStep () {
      this.publishModal = true
    },
    publishLast () {
      // 新建课程保存接口
      let courseId = this.$route.params.courseId
      if (courseId === 'add') {
        _addOnlineCourse(this.saveData).then(res => {
          this.$Message.success('发布课程成功')
          // 拿到发布完成课程后的id
          let courseId = res.id
          this.$router.push({ path: `/course/course_catalog`, query: { courseId: courseId, isNewCatalog: 1 } })
        })
      } else {
        _updateOnlineCourse(this.saveData, courseId).then(res => {
          this.$Message.success('更新课程成功')
          this.$router.push({ path: `/course/course_catalog`, query: { courseId: courseId, isNewCatalog: 0 } })
        })
      }
    },
    publish () {
      this.$refs['formInline'].validate(valid => {
        if (valid) {
          // 构建保存接口参数
          let classifyArr = this.formData.classifyGroup
          let category = {} // 类项目参数
          if (classifyArr.length === 1) {
            if (classifyArr.indexOf('学段') !== -1) {
              category = {}
              category.type = 1
              if (!this.period) {
                this.$Message.error('学段不能为空')
                return false
              } else {
                category.studyStageId = this.periodList.filter(item => {
                  return item.name === this.period
                })[0].id
              }
            }
            if (classifyArr.indexOf('项目') !== -1) {
              category = {}
              category.type = 2
              if (!this.project) {
                this.$Message.error('项目不能为空')
                return false
              } else {
                if (!this.projectSub) {
                  category.projectId = Number(this.projectOptions.filter(item => {
                    return item.name === this.project
                  })[0].id)
                } else {
                  category.projectId = Number(this.projectSubList.filter(item => {
                    return item.name === this.projectSub
                  })[0].id)
                }
              }
            }
          } else if (classifyArr.length === 2) {
            category = {}
            category.type = 0
            if (!this.period) {
              this.$Message.error('学段不能为空')
              return false
            } else {
              category.studyStageId = this.periodList.filter(item => {
                return item.name === this.period
              })[0].id
            }
            if (!this.project) {
              this.$Message.error('项目不能为空')
              return false
            } else {
              if (!this.projectSub) {
                category.projectId = Number(this.projectOptions.filter(item => {
                  return item.name === this.project
                })[0].id)
              } else {
                category.projectId = Number(this.projectSubList.filter(item => {
                  return item.name === this.projectSub
                })[0].id)
              }
            }
          }
          let platform = ''
          if (this.formData.platformGroup.length === 1) {
            if (this.formData.platformGroup[0] === '剑少五级') {
              platform = 2
            }
            if (this.formData.platformGroup[0] === '华清园') {
              platform = 1
            }
          } else if (this.formData.platformGroup.length === 2) {
            platform = 0
          }
          let introduce = this.formData.introduce
          let studyNum = this.formData.studyNum
          let promotionalUrl = this.formData.promotionalUrl
          let replay = { introduce, promotionalUrl, studyNum }
          let coverUrl = this.formData.coverUrl
          let price = this.formData.price
          let title = this.formData.title
          this.saveData = { category, coverUrl, replay, platform, price, title }
          if (this.saveData) {
            this.publishModal = true
          }
        } else {
          // 表单校验失败
          this.$Message.error('发布失败')
        }
      })
    },
    editProjectOver () {
      this.projectModal = false
      this.project = ''
      this.projectSub = ''
      this.getProjectSelect()
    },
    // 添加修改父类
    saveAddParent () {
      if (!this.parentName) {
        this.$Message.info('项目名称不能为空')
        return false
      }
      if (this.parentId) {
        _update({ name: this.parentName, id: this.parentId }).then(res => {
          this.addParentModal = false
          this.$Message.success('修改名称成功')
          this.treeArray.forEach(item => {
            if (item.id === this.parentId) {
              item.name = this.parentName
            }
            return false
          })
          this.parentName = ''
          this.parentId = ''
        })
      } else {
        _saveAdd({ name: this.parentName }).then(res => {
          this.$Message.info('添加分类成功')
          this.addParentModal = false
          // 从后台拿到返回的这条新添加的分类数据
          let currentId = res.id
          this.setTree({ id: currentId, name: this.parentName })
          this.parentName = ''
          this.parentId = ''
        })
      }
    },
    addParent () {
      this.parentName = ''
      this.addParentModal = true
    },
    renderContent (h, { root, node, data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%',
          lineHeight: '34px'
        }
      }, [
        h('span', [
          h('Icon', {
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.title)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px'
          }
        }, [
          h('Button', {
            props: {
              type: 'text'
            },
            style: {
              color: '#2d8cf0',
              fontSize: '14px'
            },
            on: {
              click: () => {
                this.addSubModal = true
                this.subName = data.title
                this.childId = data.id
                this.pid = data.pid
              }
            }
          }, '编辑'),
          h('Button', {
            props: {
              type: 'text'
            },
            style: {
              color: '#2d8cf0',
              fontSize: '14px'
            },
            on: {
              click: () => {
                _delete({ id: data.id }).then(res => {
                  this.$Message.success('删除成功')
                  this.treeArray.forEach(item => {
                    if (item.id === data.pid) {
                      item.children.forEach((child, index) => {
                        if (child.id === data.id) {
                          item.children.splice(index, 1)
                        }
                      })
                    }
                  })
                })
              }
            }
          }, '删除')
        ])
      ])
    },
    projectChange (value) {
      this.projectOptions.forEach(item => {
        if (item.name === value) {
          this.projectSubList = item.children
          this.projectSub = ''
        }
      })
    },
    getProjectSelect () {
      _getProject().then(res => {
        this.projectOptions = res.children
        this.treeArray = []
        this.projectOptions.forEach(item => {
          this.setTree(item)
        })
      })
    },
    setTree (item) {
      let treeChild = []
      if (item.hasChildren) {
        item.children.forEach((child, index) => {
          treeChild.push({ title: child.name, id: child.id, pid: child.pid, expand: false })
        })
      }
      this.treeArray.push({
        id: item.id,
        name: item.name,
        expand: true,
        render: (h, { root, node, data }) => {
          return h('span', {
            style: {
              display: 'inline-block',
              width: '100%',
              lineHeight: '34px',
              cursor: 'pointer'
            }
          }, [
            h('span', [
              h('Icon', {
                style: {
                  marginRight: '8px'
                }
              }),
              h('span', data.name)
            ]),
            h('span', {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '32px'
              }
            }, [
              h('Button', {
                props: {
                  type: 'text'
                },
                style: {
                  color: '#2d8cf0',
                  fontSize: '14px'
                },
                on: {
                  click: () => {
                    this.showSubModal(data.id)
                  }
                }
              }, '添加子类'),
              h('Button', {
                props: {
                  type: 'text'
                },
                style: {
                  color: '#2d8cf0',
                  fontSize: '14px'
                },
                on: {
                  click: () => {
                    this.showParentModal(data.id, data.name)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'text'
                },
                style: {
                  color: '#2d8cf0',
                  fontSize: '14px'
                },
                on: {
                  click: () => {
                    _delete({ id: data.id }).then(res => {
                      this.$Message.success('删除成功')
                      this.treeArray.forEach((item, index) => {
                        if (item.id === data.id) {
                          this.treeArray.splice(index, 1)
                        }
                      })
                    })
                  }
                }
              }, '删除')
            ])
          ])
        },
        children: treeChild
      })
    },
    // 修改添加子类
    saveAddSub () {
      if (!this.subName) {
        this.$Message.info('名称不能为空')
        return false
      }
      if (this.childId) {
        _update({ name: this.subName, pid: this.pid, id: this.childId }).then(res => {
          this.addSubModal = false
          this.$Message.success('修改名称成功')
          this.treeArray.forEach(item => {
            if (item.children) {
              item.children.forEach(child => {
                if (child.id === this.childId) {
                  child.title = this.subName
                }
                return false
              })
            }
            return false
          })
          this.subName = ''
          this.childId = ''
        })
      } else {
        _saveAdd({ name: this.subName, pid: this.parentId }).then(res => {
          this.addSubModal = false
          this.$Message.success('添加子类成功')
          // this.treeArray[1].children.push()
          let currentId = res.id
          this.treeArray.forEach(item => {
            if (item.id === this.parentId) {
              if (!item.children) {
                item.children = [{ title: this.subName, id: currentId, pid: this.parentId, expand: false }]
              } else {
                item.children.push({ title: this.subName, id: currentId, pid: this.parentId, expand: false })
              }
            }
          })
          this.subName = ''
          this.childId = ''
          this.parentId = ''
        })
      }
    },
    showParentModal (id, name) {
      this.addParentModal = true
      this.parentId = id
      this.parentName = name
    },
    showSubModal (parentId) {
      this.addSubModal = true
      this.parentId = parentId
    },
    // 删除当前学段
    deletePeriod (periodId) {
      _deletePeriod({ id: periodId }).then(res => {
        this.$Message.success('删除学段成功')
        this.getPeriod()
      })
    },
    getPeriod () {
      _getPeriodList().then(res => {
        this.periodList = res
      })
    },
    editProject () {
      this.projectModal = true
    },
    // 保存学段
    addPeriodOk () {
      if (this.periodId) {
        _saveCurrentPeriod({ name: this.periodName, id: this.periodId }).then(res => {
          this.periodId = null
          this.$Message.success('编辑学段成功')
          this.saveCallbacks()
        })
      } else {
        _savePeriod({ name: this.periodName }).then(res => {
          this.$Message.success('添加分类成功')
          this.saveCallbacks()
        })
      }
    },
    saveCallbacks () {
      this.periodName = ''
      this.addPeriodModal = false
      this.getPeriod()
    },
    addPeriodCancel () {
      this.addPeriodModal = false
    },
    addPeriod (item) {
      this.addPeriodModal = true
      if (item) {
        this.periodId = item.id
        this.periodName = item.name
      } else {
        this.periodName = ''
      }
    },
    periodOk () {
      this.periodModal = false
    },
    periodCancel () {
      this.periodModal = false
    },
    editPeriod () {
      this.periodModal = true
    },
    getDetail () {
      let courseId = this.$route.params.courseId
      _getCourseDetail(courseId).then(res => {
        let { category, coverUrl, replay, platform, price, title } = res
        let { projectId, studyStageId, type } = category
        let { introduce, studyNum, promotionalUrl } = replay
        this.formData = Object.assign({}, this.formData, { promotionalUrl, introduce, studyNum, coverUrl, price, title })
        // 平台显示
        if (platform === 1) {
          this.formData.platformGroup = ['华清园']
        } else if (platform === 2) {
          this.formData.platformGroup = ['剑少五级']
        } else {
          this.formData.platformGroup = ['华清园', '剑少五级']
        }
        // 项目学段显示
        if (type === 0) {
          this.formData.classifyGroup = ['学段', '项目']
          this.getPeriodName(studyStageId)
          this.getProjectName(projectId)
        } else if (type === 1) {
          this.formData.classifyGroup = ['学段']
          this.getPeriodName(studyStageId)
        } else {
          this.formData.classifyGroup = ['项目']
          this.getProjectName(projectId)
        }
      })
    },
    getPeriodName (studyStageId) {
      this.period = this.periodList.filter(item => {
        return Number(item.id) === studyStageId
      })[0].name
    },
    getProjectName (projectId) {
      this.projectOptions.forEach(item => {
        if (Number(item.id) === projectId) {
          this.project = item.name
          return false
        } else {
          if (item.children) {
            item.children.forEach(child => {
              if (Number(child.id) === projectId) {
                this.project = item.name
                this.projectChange(this.project)
                this.projectSub = child.name
              }
            })
          }
        }
      })
    },
    handleUpload (res) {
      this.$set(this.formData, 'coverUrl', res.data.fileUrl)
    }
  }
}

</script>
<style lang='less'>
  .layoutBox{
    padding-left:50px;
    padding-top:20px;
    background:#fff;
    .formBox{
      width:70%;
      position: relative;
      .inputNum{
        width:200px;
      }
      .bottom{
        width:100%;
        height:70px;
        background:#fff;
      }
      .backBtn{
        margin-right:40px;
      }
      .selectWidth{
        width:200px;
        margin-right:18px;
      }
      .lineFeed{
        margin-bottom:18px;
      }
    }
    .rowBottom{
      margin-bottom:16px;
    }
    .blueFont{
      color:#2d8cf0;
      font-size:14px;
      cursor: pointer;
      margin-right:18px;
    }
    .addText{
      .blueFont();
      float:left;
    }
    .rowBox{
      padding-top:16px;
    }
    .inputLeft{
      float:left;
      margin-top:6px;
    }
    .inputValue{
      width:80%;
      float: left;
      margin-left:20px;
    }
    .inputBox{
      height:30px;
      margin-top:50px;
      margin-bottom:20px;
    }
  }
</style>
