// 登录
export const loginUser = req => {
  req = JSON.parse(req.body)
  return {
    'sysCode': 1000,
    'msg': '',
    'data': {
      'appBeanList': null,
      'token': 'e27eb1f9-28a6-4fca-bdb8-fb58db9794d8',
      'userId': null,
      'userMobile': null,
      'userName': '超级管理员aaaa'
    }
  }
}
export const getUser = req => {
  req = JSON.parse(req.body)
  return {
    'sysCode': 1000,
    'msg': '',
    'data': {
      'appBeanList': null,
      'token': 'e27eb1f9-28a6-4fca-bdb8-fb58db9794d8',
      'userId': null,
      'userMobile': null,
      'userName': '超级管理员aaaa'
    }
  }
}
export const courses = req => {
  req = JSON.parse(req.body)
  return {
    'sysCode': 1000,
    'msg': '查询课程列表成功',
    'data': {
      'pageNum': 0,
      'pageSize': 1,
      'size': 1,
      'total': 28,
      'data': [
        {
          'id': 29,
          'type': 1,
          'name': '荷塘月色',
          'classHour': 4,
          'sales': 67,
          'price': 100,
          'coverUrl': 'https://xxbmicon.oss-cn-beijing.aliyuncs.com//zzzs1557999865997timg (2).jpg',
          'promotionalUrl': null,
          'stage': null,
          'priority': 7,
          'publishTime': null,
          'introduce': '<p>朱自清</p>',
          'isValid': 1,
          'courseFrom': 1
        },
        {
          'id': 30,
          'type': 0,
          'name': '我的大学',
          'classHour': 4,
          'sales': 67,
          'price': 200,
          'coverUrl': 'https://xxbmicon.oss-cn-beijing.aliyuncs.com//zzzs1557999865997timg (2).jpg',
          'promotionalUrl': null,
          'stage': null,
          'priority': 7,
          'publishTime': null,
          'introduce': '<p>朱自清</p>',
          'isValid': 1,
          'courseFrom': 1
        }
      ]
    }
  }
}
export const coursesDetail = req => {
  req = JSON.parse(req.body)
  return {
    'sysCode': 1000,
    'msg': '查询课程列表成功',
    'data': {
      'id': 30,
      'type': 0,
      'name': '我的大学',
      'classHour': 4,
      'sales': 67,
      'price': 200,
      'coverUrl': 'https://xxbmicon.oss-cn-beijing.aliyuncs.com//zzzs1557999865997timg (2).jpg',
      'promotionalUrl': null,
      'stage': null,
      'priority': 7,
      'publishTime': null,
      'introduce': '<p>朱自清</p>',
      'isValid': 1,
      'courseFrom': 1
    }
  }
}
export const studyStages = req => {
  req = JSON.parse(req.body)
  return {
    'sysCode': 1000,
    'msg': '获取所有学段成功',
    'data': [
      {
        'id': 1,
        'name': '学前',
        'deleteFlg': 0
      },
      {
        'id': 2,
        'name': '小学',
        'deleteFlg': 0
      },
      {
        'id': 3,
        'name': '初中',
        'deleteFlg': 0
      },
      {
        'id': 4,
        'name': '高中',
        'deleteFlg': 0
      }
    ]
  }
}
