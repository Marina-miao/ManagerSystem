<template lang="pug">
  .upload-video(style="width:240px;")
    Upload(:action="action" accept="video/*" :show-upload-list="false" :on-success="handleUploadSuccess" :before-upload="beforeUpload" :on-progress="handleProcess")
      Button(type="primary" :loading="isLoading") {{isLoading ? '上传中' : '上传视频'}}
    Card.preview(title="视频预览" icon="logo-youtube" :padding="0" dis-hover style="margin-top: 20px;")
      video(v-if="videoUrl" ref="video" :src="videoUrl" preload="auto" controls style="height:300px;vertical-align: middle;")
      //- i-circle(v-else :percent="percent" :size="200" style="margin: 10px")
      //-   span(style="font-size:24px") {{ percent }}%
</template>

<script>
export default {
  name: 'UploadVideo',
  props: ['action', 'videoUrl', 'videoDuration'],
  data () {
    return {
      percent: 0,
      timer: null,
      isLoading: false
    }
  },
  mounted () {
    this.setTimer()
  },
  beforeDestroy () {
    this.timer && clearInterval(this.timer)
  },
  methods: {
    beforeUpload () {
      this.isLoading = true
      this.$emit('update:videoUrl', '')
      this.percent = 0
    },
    handleProcess ({ loaded, total }) {
      this.percent = parseInt(loaded / total * 100)
      // console.log(this.percent)
    },
    handleUploadSuccess ({ data }) {
      this.isLoading = false
      this.$emit('update:videoUrl', data.fileUrl)
      this.percent = 100
      this.setTimer()
      // this.$parent.$refs['form'].validateField(key)
    },
    setTimer () {
      // if (this.timer) return
      let timer = setInterval(() => {
        if (this.$refs.video && this.$refs.video.duration) {
          // this.$emit('update:videoDuration', this.$refs.video.duration)
          clearInterval(timer)
        }
      }, 100)
    }
  }
}
</script>

<style lang="less">
  .upload-video {
    .preview {
      .ivu-card-body {
        text-align: center;
      }
    }
  }
</style>
