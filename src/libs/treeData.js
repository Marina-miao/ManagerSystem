class TreeData {
  constructor (title, children, addSub, editParent, deleteParent) {
    this.title = title
    this.expand = false
    this.render = (h, { root, node, data }) => {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%',
          lineHeight: '34px',
          cursor: 'pointer'
        }
      }, [
        h('span', {
          style: {
            marginRight: '8px'
          },
          on: {
            click: () => {
              console.log(data)
              this.expand = !this.expand
            }
          }
        }, [
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
              marginRight: '8px',
              color: '#2d8cf0',
              fontSize: '14px'
            },
            on: addSub
          }, '添加子类'),
          h('Button', {
            props: {
              type: 'text'
            },
            style: {
              marginRight: '8px',
              color: '#2d8cf0',
              fontSize: '14px'
            },
            on: editParent
          }, '编辑'),
          h('Button', {
            props: {
              type: 'text'
            },
            style: {
              color: '#2d8cf0',
              fontSize: '14px'
            },
            on: deleteParent
          }, '删除')
        ])
      ])
    }
    this.children = children
  }
}
export default TreeData
