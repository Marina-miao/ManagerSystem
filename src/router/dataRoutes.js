import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

// 业务路由
export default [
  {
    path: '/carousel',
    name: '_carousel',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'carousel_list',
        name: 'carousel_list',
        meta: {
          title: '轮播图管理',
          notCache: true
        },
        component: () => import('@/view/carousel/carousel-list.vue')
      }
    ]
  },
  {
    path: '/notice',
    name: '_notice',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'notice_list',
        name: 'notice_list',
        meta: {
          title: '文字广告管理',
          notCache: true
        },
        component: () => import('@/view/notice/notice-list.vue')
      }
    ]
  },
  {
    path: '/activity',
    name: '_activity',
    component: Main,
    meta: {
      title: '活动管理',
      notCache: true,
      hideInBread: true
    },
    children: [
      {
        path: 'activity_list',
        name: 'activity_list',
        meta: {
          title: '活动列表',
          notCache: true
        },
        component: () => import('@/view/activity/activity-list.vue')
      },
      {
        path: 'activity_detail/:activityId',
        name: 'activity_detail',
        meta: {
          title: '活动详情',
          notCache: true,
          hideInMenu: true
        },
        component: () => import('@/view/activity/activity-detail.vue')
      },
      {
        path: 'activity_signUp',
        name: 'activity_signUp',
        meta: {
          title: '活动报名列表',
          notCache: true
        },
        component: () => import('@/view/activity/activity-signUp.vue')
      }
    ]
  },
  {
    path: '/course',
    name: '_course',
    component: Main,
    meta: {
      title: '课程管理',
      hideInBread: true
    },
    children: [
      {
        path: 'course_list',
        name: 'course_list',
        meta: {
          title: '课程列表',
          notCache: true
        },
        component: () => import('@/view/course/course-list.vue')
      },
      {
        path: 'course_comment',
        name: 'course_comment',
        meta: {
          title: '课程评论',
          notCache: true
        },
        component: () => import('@/view/course/course-comment.vue')
      },
      {
        path: 'course_offlineDetail/:courseId',
        name: 'course_offlineDetail',
        meta: {
          title: '面授课程',
          notCache: true,
          hideInMenu: true
        },
        component: () => import('@/view/course/course-offlineDetail.vue')
      },
      {
        path: 'course_onlineDetail/:courseId',
        name: 'course_onlineDetail',
        meta: {
          title: '线上课程',
          notCache: true,
          hideInMenu: true
        },
        component: () => import('@/view/course/course-onlineDetail.vue')
      },
      {
        path: 'course_timetable',
        name: 'course_timetable',
        meta: {
          title: '课表',
          notCache: true,
          hideInMenu: true
        },
        component: () => import('@/view/course/course-timetable.vue')
      },
      {
        path: 'course_catalog',
        name: 'course_catalog',
        meta: {
          title: '目录',
          notCache: true,
          hideInMenu: true
        },
        component: () => import('@/view/course/course-catalog.vue')
      }
    ]
  },
  {
    path: '/coupon',
    name: '_coupon',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'coupon_list',
        name: 'coupon_list',
        meta: {
          title: '优惠券管理',
          notCache: true
        },
        component: () => import('@/view/coupon/coupon-list.vue')
      },
      {
        path: 'coupon_detail/:couponId',
        name: 'coupon_detail',
        meta: {
          title: '优惠券详情',
          notCache: true,
          hideInMenu: true
        },
        component: () => import('@/view/coupon/coupon-detail.vue')
      }
    ]
  }
]
