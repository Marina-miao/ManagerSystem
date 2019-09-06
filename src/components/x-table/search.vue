<template>
  <Form :model="form" :label-width="80" inline class="x-table-search">
    <FormItem v-for="v of search" :key="v.key" :label="v.label" v-bind="v.itemProps || {}" v-show="v.visible !== false">
      <Select v-if="v.select" v-model="form[v.key]" placeholder="全部" clearable style="width: 160px"
              v-bind="v.props || {}" @on-change="val=>handleChange(val, v.key)">
        <Option v-for="(m, n) of v.select" :key="n" :value="m.value !== undefined ? m.value : m">{{ m.label || m }}</Option>
      </Select>
      <Input v-else v-model="form[v.key]" v-bind="v.props || {}"/>
    </FormItem>
    <FormItem :label-width="20" v-if="search.length && !search.every(v=>v.visible === false)">
      <Button type="primary" icon="ios-search" @click="handleSearch" style="margin-right: 20px">查询</Button>
      <Button type="primary" icon="md-refresh" @click="handleReset">重置</Button>
    </FormItem>
  </Form>
</template>

<script>
export default {
  name: 'x-search',
  props: ['search'],
  data () {
    return {
      form: {}
    }
  },
  mounted () {
    this.search.forEach(v => v.default && this.$set(this.form, v.key, v.default))
    this.handleSearch()
  },
  methods: {
    handleChange (val, key) {
      this.$emit('on-change', val, key)
    },
    handleSearch () {
      this.$emit('on-search')
    },
    handleReset () {
      Object.keys(this.form).forEach(k => {
        const { visible, props } = this.search.find(v => k === v.key)
        // eslint-disable-next-line no-mixed-operators
        if (visible !== false || props && props.disabled !== true) (this.form[k] = undefined)
      })
      this.handleSearch()
    }
  }
}
</script>

<style>
  .x-table-search.ivu-form .ivu-form-item-label {
    text-align: center;
  }
</style>
