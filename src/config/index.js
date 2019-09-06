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
    dev: 'http://192.168.12.72:9002',
    pro: 'http://192.168.12.72:9002',
    center: 'http://39.98.53.212:8791'
  },
  ueditor: {
    UEDITOR_HOME_URL: '/UEditor/',
    // UEDITOR_HOME_URL: 'http://xcx.qhyzzzs.com/ueditor/ueditor1_4_3-utf8-jsp/jsp/',
    // UEDITOR_HOME_URL: '/UEditor/',
    // serverUrl: 'http://35.201.165.105:8000/controller.php',
    // serverUrl: 'http://192.168.0.113:9192/ueditor/ueditor1_4_3-utf8-jsp/jsp/controller.jsp',
    // langPath: '/UEditor/lang/',
    initialFrameWidth: '100%',
    initialFrameHeight: '260',
    autoHeightEnabled: true,
    toolbars: [[
      'fullscreen', 'source', '|', 'undo', 'redo', '|',
      'bold', 'italic', 'underline', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
      'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
      'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
      'indent', '|',
      'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
      'link', 'simpleupload', 'insertimage', 'emotion', 'insertvideo', 'music', 'attachment', 'date', 'spechars', '|',
      'inserttable', 'preview'
    ]]
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
