<template>
  <div class="x-table">
    <slot name="search">
      <XSearch v-if="search.length" :search="search" :columns="columns" @on-search="handleSearch">
        <slot name="btn"></slot>
      </XSearch>
    </slot>
    <Table
      v-show="isTableShow"
      ref="tablesMain"
      :data="insideTableData"
      :columns="insideColumns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
      style="margin-top: 20px"
    >
      <slot name="header" slot="header"></slot>
      <slot name="footer" slot="footer"></slot>
      <slot name="loading" slot="loading"></slot>
    </Table>
    <Page v-if="page.total && (page['page-size'] <= page.total)" v-bind="page" @on-change="onPageChange" @on-page-size-change="onPageSizeChange"/>
  </div>
</template>

<script>
import TablesEdit from './edit.vue'
import XSearch from './search.vue'

export default {
  name: 'XTable',
  components: { XSearch },
  props: {
    isTableShow: true,
    search: {
      type: Array,
      default () {
        return []
      }
    },
    value: {
      type: Array,
      default () {
        return []
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    page: {
      type: Object,
      default () {
        return {
          'page-size': 10
        }
      }
    },
    size: String,
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default () {
        return ''
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    alignCenter: {
      type: Boolean,
      default: true
    }
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data () {
    return {
      insideColumns: [],
      insideTableData: [],
      edittingCellId: '',
      edittingText: ''
    }
  },
  methods: {
    handleSearch (form) {
      this.$emit('on-search', form)
    },
    handleAdd () {
      this.$emit('on-add')
    },
    suportEdit (item, index) {
      item.render = (h, params) => {
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable
          },
          on: {
            'input': val => {
              this.edittingText = val
            },
            'on-start-edit': (params) => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`
              this.$emit('on-start-edit', params)
            },
            'on-cancel-edit': (params) => {
              this.edittingCellId = ''
              this.$emit('on-cancel-edit', params)
            },
            'on-save-edit': (params) => {
              this.value[params.row.initRowIndex][params.column.key] = this.edittingText
              this.$emit('input', this.value)
              this.$emit('on-save-edit', Object.assign(params, { value: this.edittingText }))
              this.edittingCellId = ''
            }
          }
        })
      }
      return item
    },
    surportHandle (item) {
      let buttons = item.buttons || []
      let insideBtns = []
      buttons.forEach(v => insideBtns.push(this.createButton(typeof v === 'string' ? { name: v } : v)))
      item.render = (h, params) => {
        params.tableData = this.value
        return h('div', { class: 'handle' }, insideBtns.map(item => item(h, params, this)))
      }
      return item
    },
    createButton ({ name, text, type, confirm, render }) {
      const btn = {
        name,
        text: text || (name === 'check' ? '查看' : name === 'edit' ? '编辑' : name === 'delete' ? '删除' : '按钮'),
        type: type || (name === 'check' ? 'success' : name === 'delete' ? 'error' : 'primary'),
        confirm,
        render
      }
      return (h, params, vm) => {
        return btn.render ? btn.render(h, params, vm)
          : (btn.confirm || btn.name === 'delete'
            ? h('Poptip', {
              props: {
                confirm: true,
                title: typeof btn.confirm === 'string' ? btn.confirm : `确定要${btn.text}吗?`
              },
              on: {
                'on-ok': () => {
                  vm.$emit(`on-${btn.name}`, params)
                }
              }
            }, [
              h('Button', {
                props: {
                  type: btn.type,
                  size: 'small'
                }
              }, btn.text)
            ])
            : h('Button', {
              props: {
                type: btn.type,
                size: 'small'
              },
              on: {
                click: () => {
                  vm.$emit(`on-${btn.name}`, params)
                }
              }
            }, btn.text))
      }
    },
    handleColumns (columns) {
      this.insideColumns = columns.map((item, index) => {
        let res = item
        if (res.editable) res = this.suportEdit(res, index)
        if (res.key === 'handle') res = this.surportHandle(res)
        if (this.alignCenter && res.align === undefined) res.align = 'center'
        return res
      })
    },
    handleTableData () {
      this.insideTableData = this.value.map((item, index) => {
        let res = item
        res.initRowIndex = index
        return res
      })
    },
    handlePage () {
      if (!this.page['page-size']) this.$set(this.page, 'page-size', 10)
    },
    exportCsv (params) {
      this.$refs.tablesMain.exportCsv(params)
    },
    clearCurrentRow () {
      this.$refs.talbesMain.clearCurrentRow()
    },
    onCurrentChange (currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onSelect (selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel (selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll (selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange (selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange (column, key, order) {
      this.$emit('on-sort-change', column, key, order)
    },
    onFilterChange (row) {
      this.$emit('on-filter-change', row)
    },
    onRowClick (row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick (row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand (row, status) {
      this.$emit('on-expand', row, status)
    },
    onPageChange (current) {
      this.$emit('on-page-change', current)
    },
    onPageSizeChange (pageSize) {
      this.$emit('on-page-size-change', pageSize)
    }
  },
  watch: {
    columns (columns) {
      this.handleColumns(columns)
    },
    value (val) {
      this.handleTableData()
    }
  },
  mounted () {
    this.handleColumns(this.columns)
    this.handleTableData()
    this.handlePage()
  }
}
</script>

<style lang="less">
  .x-table {
    .handle .ivu-btn {
      margin: 5px 10px 0 0;
    }
    .ivu-page {
      margin-top: 20px;
      text-align: center;
    }
  }
  .ivu-table-wrapper{
    overflow: visible !important;
  }
</style>
