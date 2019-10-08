<template>
  <Form :model="form" :label-width="90" label-position="right" inline>
    <FormItem v-for="v of search" :key="v.key" :label="v.label">
      <Select v-if="v.select && !v.isFilter" v-model="form[v.key]" placeholder="全部" clearable style="width: 200px">
        <Option v-for="(m, n) of v.select" :key="n" :value="m.value">{{ m.label }}</Option>
      </Select>
      <Select v-if="v.select && v.isFilter" filterable v-model="form[v.key]" placeholder="全部" clearable style="width: 200px">
        <Option v-for="(m, n) of v.select" :key="n" :value="m.value">{{ m.label }}</Option>
      </Select>
      <Input v-if="!v.select" v-model="form[v.key]"/>
    </FormItem>
    <FormItem :label-width="20">
      <Button type="primary" icon="ios-search" @click="handleSearch">搜索</Button>
    </FormItem>
    <slot></slot>
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
  created () {
  },
  methods: {
    handleSearch () {
      this.$emit('on-search', this.form)
    }
  }
}
</script>

<style scoped>

</style>
