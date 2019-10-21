<template>
  <Form :model="form" :label-width="90" label-position="right" inline>
    <FormItem v-for="v of search" :key="v.key" :label="v.label">
      <Select v-if="v.select && !v.isFilter" v-model="form[v.key]" placeholder="全部" clearable style="width: 200px">
        <Option v-for="(m, n) of v.select" :key="n" :value="m.value">{{ m.label }}</Option>
      </Select>
      <Select v-if="v.select && v.isFilter" filterable v-model="form[v.key]" placeholder="全部" clearable style="width: 200px">
        <Option v-for="(m, n) of v.select" :key="n" :value="m.value">{{ m.label }}</Option>
      </Select>
      <Input v-if="!v.select && !v.type" v-model="form[v.key]" clearable/>
      <span v-if="v.type === 'date'">
        <DatePicker type="datetime" v-model="startTime" placeholder="开始时间" style="margin-right:20px;"></DatePicker>
        <DatePicker type="datetime" v-model="endTime" placeholder="结束时间"></DatePicker>
      </span>
    </FormItem>
    <FormItem :label-width="20">
      <Button type="primary" icon="ios-search" @click="handleSearch">搜索</Button>
    </FormItem>
    <slot></slot>
  </Form>

</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'x-search',
  props: ['search'],
  data () {
    return {
      form: {},
      startTime: null,
      endTime: null
    }
  },
  created () {
  },
  methods: {
    handleSearch () {
      if (this.startTime && this.endTime) {
        let startTime = this.startTime.getTime()
        let endTime = this.endTime.getTime()
        if (endTime <= startTime) {
          this.$Message.error('结束时间不能小于开始时间')
          return
        }
      }
      if (this.startTime) {
        let startTime = dayjs(this.startTime).format('YYYY-MM-DD HH:mm:ss')
        this.$set(this.form, 'startTime', startTime)
      }
      if (this.endTime) {
        let endTime = dayjs(this.endTime).format('YYYY-MM-DD HH:mm:ss')
        this.$set(this.form, 'endTime', endTime)
      }
      this.$emit('on-search', this.form)
    }
  }
}
</script>

<style scoped>

</style>
