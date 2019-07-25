<template lang="pug">
  Upload(:action="action" :headers="headers" :default-file-list="fileList" :on-success="onSuccess" :on-preview="onPreview" :on-remove="onRemove" v-bind="$attrs")
    slot
</template>

<script>
import config from '@/config'
import { getToken } from '@/libs/util'
import { downloadFile } from '@/libs/tools'

export default {
  name: 'XUpload',
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    action: {
      type: String,
      default () {
        return `${process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro}/api/file/uploadFile`
      }
    },
    headers: {
      type: Object,
      default () {
        return {
          'Token': getToken()
        }
      }
    }
  },
  computed: {
    fileList () {
      return this.value.length ? this.value.map(v => ({ ...v, name: v.key.split('/')[v.key.split('/').length - 1] })) : []
    }
  },
  methods: {
    onSuccess ({ sysCode, data }) {
      if (sysCode !== 1000) return this.$Message.warning('上传失败')
      this.fileList.push(...data)
      this.$emit('input', this.fileList)
    },
    onPreview (file) {
      downloadFile(`${process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro}/api/file/downloadFile?key=${file.key}`, file.key)
    },
    onRemove (file, fileList) {
      this.$emit('input', fileList)
    }
  }
}
</script>

<style lang="less">
  .ivu-upload[disabled="disabled"] {
    .ivu-upload-select {
      display: none;
    }
    
    .ivu-upload-list-remove {
      display: none;
    }
  }
</style>
