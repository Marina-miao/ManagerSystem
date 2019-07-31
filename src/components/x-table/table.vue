<template>
  <div class="x-table">
    <slot name="search">
      <XSearch :search="search" @on-change="handleChange" @on-search="handleSearch"/>
    </slot>
    <slot name="prepend"></slot>
    <slot v-if="!!showButtons">
      <Button v-if="typeof showButtons === 'boolean' ? true : showButtons.includes('add')" type="primary"
              @click="handleAdd" style="margin: 0 20px 20px 0">新增
      </Button>
      <Button v-if="typeof showButtons === 'boolean' ? true : showButtons.includes('edit')" type="primary"
              @click="handleEdit" style="margin: 0 20px 20px 0">修改
      </Button>
      <Button v-if="typeof showButtons === 'boolean' ? true : showButtons.includes('delete')" type="primary"
              @click="handleDelete" style="margin: 0 20px 20px 0">删除
      </Button>
    </slot>
    <slot name="append"></slot>
    <Table
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
    >
      <slot name="header" slot="header"></slot>
      <slot name="footer" slot="footer"></slot>
      <slot name="loading" slot="loading"></slot>
    </Table>
    <Page v-if="page['page-size'] < page.total" v-bind="page" @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"/>
  </div>
</template>

<script>
  import TablesEdit from './edit.vue'
  import XSearch from './search.vue'
  import * as dataApi from '@/api/data'

  export default {
    name: 'XTable',
    components: { XSearch },
    props: {
      search: {
        type: Array,
        default() {
          return []
        },
      },
      showButtons: {
        type: [Boolean, Array],
        default() {
          return ['add']
        },
      },
      value: {
        type: Array,
        default() {
          return []
        },
      },
      columns: {
        type: Array,
        default() {
          return []
        },
      },
      size: String,
      width: {
        type: [Number, String],
      },
      height: {
        type: [Number, String],
      },
      stripe: {
        type: Boolean,
        default: false,
      },
      border: {
        type: Boolean,
        default: true,
      },
      showHeader: {
        type: Boolean,
        default: true,
      },
      highlightRow: {
        type: Boolean,
        default: false,
      },
      rowClassName: {
        type: Function,
        default() {
          return ''
        },
      },
      context: {
        type: Object,
      },
      noDataText: {
        type: String,
      },
      noFilteredDataText: {
        type: String,
      },
      disabledHover: {
        type: Boolean,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      /**
       * @description 全局设置是否可编辑
       */
      editable: {
        type: Boolean,
        default: false,
      },
      alignCenter: {
        type: Boolean,
        default: true,
      },
      action: {
        type: String,
      },
    },
    /**
     * Events
     * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
     * @on-cancel-edit 返回值 {Object} 同上
     * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
     */
    data() {
      return {
        insideColumns: [],
        insideTableData: [],
        edittingCellId: '',
        edittingText: '',
        form: {},
        page: {
          current: 1,
          total: 1,
          'page-size': 10,
        },
        currentRow: null,
      }
    },
    methods: {
      handleChange(val, key) {
        this.$emit(`on-${ key }-change`, val)
      },
      handleSearch(form) {
        this.form = form
        if (this.action) {
          this.page.current = 1
          return this.fetchTableData()
        }
        this.$emit('on-search', form)
      },
      hasCurrentRow(cb, msg = '请先选择一条记录') {
        if (!this.currentRow) return this.$Message.warning(msg)
        cb()
      },
      handleAdd() {
        this.$emit('on-add')
      },
      handleEdit() {
        this.hasCurrentRow(() => this.$emit('on-edit', this.currentRow))
      },
      handleDelete() {
        this.hasCurrentRow(() => this.$Modal.confirm({
          title: '删除记录',
          content: '如果删除该记录，则该条记录将永久删除，确认删除吗？',
          onOk: () => this.$emit('on-delete', this.currentRow),

        }))
      },
      supportRadio(item) {
        item.render = (h, { row, index }) => h('Radio', {
          props: { value: row.checked },
          on: {
            'on-change': () => {
              this.currentRow = row
              this.insideTableData = this.insideTableData.map((v, i) => ({ ...v, checked: i === index }))
              this.$emit('input', this.insideTableData)
              this.$emit('on-radio-change', row, index)
            },
          },
        })
        return item
      },
      supportEdit(item, index) {
        item.render = (h, params) => {
          return h(TablesEdit, {
            props: {
              params: params,
              value: this.insideTableData[params.index][params.column.key],
              edittingCellId: this.edittingCellId,
              editable: this.editable,
            },
            on: {
              'input': val => {
                this.edittingText = val
              },
              'on-start-edit': (params) => {
                this.edittingCellId = `editting-${ params.index }-${ params.column.key }`
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
              },
            },
          })
        }
        return item
      },
      supportHandle(item) {
        let buttonsGenerator = typeof item.buttons === 'function' ? item.buttons : params => item.buttons || []
        item.render = (h, params) => {
          params.tableData = this.value
          return h('div', { class: 'handle' }, buttonsGenerator(params.row).filter(v => !!v).map(v => this.createButton(typeof v === 'string' ? { name: v } : v)).map(btn => btn(h, params, this)))
        }
        return item
      },
      createButton({ name, text, type, confirm, render }) {
        const btn = {
          name,
          text: text || (name === 'check' ? '查看' : name === 'edit' ? '编辑' : name === 'delete' ? '删除' : '按钮'),
          type: type || (name === 'check' ? 'success' : name === 'delete' ? 'error' : 'primary'),
          confirm,
          render,
        }
        return (h, params, vm) => {
          return btn.render ? btn.render(h, params, vm)
            : (btn.confirm || btn.name === 'delete'
              ? h('Poptip', {
                props: {
                  confirm: true,
                  title: typeof btn.confirm === 'string' ? btn.confirm : `确定要${ btn.text }吗?`,
                },
                on: {
                  'on-ok': () => {
                    vm.$emit(`on-${ btn.name }`, params)
                  },
                },
              }, [
                h('Button', {
                  props: {
                    type: btn.type,
                    size: 'small',
                  },
                }, btn.text),
              ])
              : h('Button', {
                props: {
                  type: btn.type,
                  size: 'small',
                },
                on: {
                  click: () => {
                    vm.$emit(`on-${ btn.name }`, params)
                  },
                },
              }, btn.text))
        }
      },
      handleColumns(columns) {
        this.insideColumns = columns.map((item, index) => {
          let res = item
          if (res.type === 'radio') res = this.supportRadio(res)
          if (res.editable) res = this.supportEdit(res, index)
          if (res.key === 'handle') res = this.supportHandle(res)
          if (this.alignCenter && res.align === undefined) res.align = 'center'
          return res
        })
      },
      handleTableData() {
        this.insideTableData = this.value.map((item, index) => {
          let res = item
          res.initRowIndex = index
          return res
        })
      },
      handlePage() {
        if (!this.page['page-size']) this.$set(this.page, 'page-size', 10)
      },
      exportCsv(params) {
        this.$refs.tablesMain.exportCsv(params)
      },
      clearCurrentRow() {
        this.$refs.talbesMain.clearCurrentRow()
      },
      onCurrentChange(currentRow, oldCurrentRow) {
        this.$emit('on-current-change', currentRow, oldCurrentRow)
      },
      onSelect(selection, row) {
        this.$emit('on-select', selection, row)
      },
      onSelectCancel(selection, row) {
        this.$emit('on-select-cancel', selection, row)
      },
      onSelectAll(selection) {
        this.$emit('on-select-all', selection)
      },
      onSelectionChange(selection) {
        this.$emit('on-selection-change', selection)
      },
      onSortChange(column, key, order) {
        this.$emit('on-sort-change', column, key, order)
      },
      onFilterChange(row) {
        this.$emit('on-filter-change', row)
      },
      onRowClick(row, index) {
        this.$emit('on-row-click', row, index)
      },
      onRowDblclick(row, index) {
        this.$emit('on-row-dblclick', row, index)
      },
      onExpand(row, status) {
        this.$emit('on-expand', row, status)
      },
      onPageChange(current) {
        this.page.current = current
        this.fetchTableData()
      },
      onPageSizeChange(pageSize) {
        this.$emit('on-page-size-change', pageSize)
      },
      fetchTableData() {
        if (!this.action) return

        dataApi[this.action]({
          ...this.form,
          start: (this.page.current - 1) * this.page['page-size'],
          length: this.page['page-size'],
        }).then(({ data, recordsTotal }) => {
          this.insideTableData = data.map(v => ({ ...v, checked: false }))
          this.page.total = recordsTotal
          this.currentRow = null
        })
      },
    },
    watch: {
      columns(columns) {
        this.handleColumns(columns)
      },
      value(val) {
        this.handleTableData()
      },
    },
    mounted() {
      if (!this.showButtons && this.columns[0].type === 'radio') this.columns.shift()
      this.handleColumns(this.columns)
      this.handleTableData()
      this.handlePage()
    },
  }
</script>

<style lang="less">
  .x-table {
    .ivu-table-wrapper {
      overflow: visible;
    }

    .handle .ivu-btn {
      margin: 5px 10px 5px 0;
    }

    .ivu-page {
      margin-top: 20px;
      text-align: center;
    }
  }
</style>
