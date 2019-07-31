<template lang="pug">
  Form(ref="form" :model="value" :rules="rules" :label-width="96" label-position="left")
    Row(v-for="(s, si) of schema" :key="`m-${si}`" :gutter="20")
      Col(v-for="(item, itemIdx) of s.row" :key="`m-${si}-${itemIdx}`" :span="s.span || (24 / s.row.length)")
        FormItem(:label="item.label" :prop="item.key" v-bind="item.itemProps")
          Select(v-if="item.select" v-model="value[item.key]" v-bind="item.props" @on-change="$emit('input', value)" style="width: 100%")
            Option(v-for="(o, oi) of item.select" :key="`o-${si}-${itemIdx}-${oi}`" :value="o.value !== undefined ? o.value : o") {{ o.label !== undefined ? o.label : o }}
          DatePicker(v-else-if="item.date" v-model="value[item.key]" placeholder="请选择" v-bind="item.props" @on-change="$emit('input', value)" style="width: 100%")
          Input(v-else v-model="value[item.key]" placeholder="请输入"  v-bind="item.props" @on-change="$emit('input', value)" style="width: 100%")
</template>

<script>
export default {
  name: 'x-form',
  props: {
    value: {
      required: true,
      type: Object
    },
    rules: {
      type: Object,
      default () {
        return {}
      }
    },
    schema: {
      type: Array,
      default () {
        return []
      }
    }
  },
  mounted () {
    this.$form = this.$refs.form
  },
  methods: {
    validate (cb) {
      return this.$form.validate(cb)
    },
    validateField (prop, cb) {
      return this.$form.validateField(prop, cb)
    },
    resetFields () {
      return this.$form.resetFields
    }
  }
}
</script>
