export default {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: 'http://192.168.0.169:8097',
    pro: 'http://39.98.53.212:8762'
  },
  /**
   * @description UEditor 配置
   */
  ueditor: {
    autoHeightEnabled: false,
    initialFrameHeight: 240,
    initialFrameWidth: '100%',
    UEDITOR_HOME_URL: './UEditor/',
    serverUrl: 'http://35.201.165.105:8000/controller.php',
    // UEDITOR_HOME_URL: 'http://192.168.0.113:9193/ueditor/ueditor1_4_3-utf8-jsp/',
    // UEDITOR_HOME_URL: 'http://123.56.21.11:6089/ueditor/ueditor1_4_3-utf8-jsp/',
    toolbars: [
      [
        'fullscreen',
        'source',
        '|',
        'undo',
        'redo',
        '|',
        'bold',
        'italic',
        'underline',
        'removeformat',
        'formatmatch',
        'autotypeset',
        'blockquote',
        'pasteplain',
        '|',
        'forecolor',
        'backcolor',
        'insertorderedlist',
        'insertunorderedlist',
        'selectall',
        'cleardoc',
        '|',
        'rowspacingtop',
        'rowspacingbottom',
        'lineheight',
        '|',
        'customstyle',
        'paragraph',
        'fontfamily',
        'fontsize',
        '|',
        'indent',
        '|',
        'justifyleft',
        'justifycenter',
        'justifyright',
        'justifyjustify',
        '|',
        'link',
        'simpleupload',
        'insertimage',
        'emotion',
        'insertvideo',
        'music',
        'attachment',
        'date',
        'spechars',
        '|',
        'inserttable',
        'preview'
      ]
    ]
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: false, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  }
}
