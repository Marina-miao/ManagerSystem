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
    path: '/basics',
    name: 'basics',
    component: Main,
    meta: {
      hideInBread: true,
      title: '基础管理'
    },
    children: [
      {
        path: 'campus/campus',
        name: 'basics_campus',
        meta: {
          title: '校区管理',
          icon: 'md-home',
          notCache: true
        },
        component: () => import('@/view/basics/campus/campus.vue')
      },
      {
        path: 'teacher/teacher',
        name: 'basics_teacher',
        meta: {
          title: '教师管理',
          icon: 'md-home',
          notCache: true
        },
        component: () => import('@/view/basics/teacher/teacher.vue')
      },
      {
        path: 'course/course',
        name: 'basics_course',
        meta: {
          title: '课程管理',
          icon: 'md-home',
          notCache: true
        },
        component: () => import('@/view/basics/course/course.vue')
      },
      {
        path: 'student/students',
        name: 'basics_student',
        meta: {
          title: '学生管理',
          icon: 'md-home',
          notCache: true
        },
        component: () => import('@/view/basics/student/students.vue')
      },
      {
        path: 'campus/campushandle/:id',
        name: 'handle',
        meta: {
          title: '校区管理',
          hideInMenu: true
        },
        props: true,
        component: () => import('@/view/basics/campus/campushandle.vue')
      },
      {
        path: 'teacher/teacherhandle/:id',
        name: 'handle',
        meta: {
          title: '教师管理',
          hideInMenu: true
        },
        props: true,
        component: () => import('@/view/basics/teacher/teacherhandle.vue')
      },
      {
        path: 'course/coursehandle/:id',
        name: 'handle',
        meta: {
          title: '编辑课程管理',
          hideInMenu: true
        },
        props: true,
        component: () => import('@/view/basics/course/coursehandle.vue')
      },
      {
        path: 'student/studenthandle/:id',
        name: 'handle',
        meta: {
          title: '编辑学生管理',
          hideInMenu: true
        },
        props: true,
        component: () => import('@/view/basics/student/studenthandle.vue')
      }
    ]
  },
  {
    path: '/attendance',
    name: 'attendance',
    component: Main,
    meta: {
      hideInBread: true,
      title: '考勤管理'
    },
    children: [
      {
        path: 'student',
        name: 'attendance_student',
        meta: {
          title: '学生考勤总览',
          icon: '',
          notCache: true
        },
        component: () => import('@/view/attendance/student/student.vue')
      },
      {
        path: 'studentclass',
        name: 'stu_studentclass',
        meta: {
          title: '学生班课考勤详情',
          icon: '',
          notCache: true
        },
        component: () => import('@/view/attendance/student/studentclass.vue')
      },
      {
        path: 'student1v1',
        name: 'stu_student1v1',
        meta: {
          title: '学生1V1考勤详情',
          icon: '',
          notCache: true
        },
        component: () => import('@/view/attendance/student/student1v1.vue')
      },
      {
        path: 'teacher',
        name: 'attendance_teacher',
        meta: {
          title: '教师考勤总览',
          icon: '',
          notCache: true
        },
        component: () => import('@/view/attendance/teacher/teacher.vue')
      },
      {
        path: 'teacherclass',
        name: 'tea_teacherclass',
        meta: {
          title: '教师班课考勤详情',
          icon: '',
          notCache: true
        },
        component: () => import('@/view/attendance/teacher/teacherclass.vue')
      },
      {
        path: 'teacher1v1',
        name: 'tea_teacher1v1',
        meta: {
          title: '教师1V1考勤详情',
          icon: '',
          notCache: true
        },
        component: () => import('@/view/attendance/teacher/teacher1v1.vue')
      },
      {
        path: 'course/course',
        name: 'attendance_course',
        meta: {
          title: '班级课程考勤',
          icon: '',
          notCache: true
        },
        component: () => import('@/view/attendance/course/course.vue')
      },
      {
        path: 'student/studetails/:id',
        name: 'handle',
        meta: {
          title: '学生考勤详情',
          hideInMenu: true
        },
        props: true,
        component: () => import('@/view/attendance/student/studetails.vue')
      },
      {
        path: 'teacher/teadetails/:id',
        name: 'handle',
        meta: {
          title: '教师考勤详情',
          hideInMenu: true
        },
        props: true,
        component: () => import('@/view/attendance/teacher/teadetails.vue')
      }
    ]
  }
]
