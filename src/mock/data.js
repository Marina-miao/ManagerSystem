// 登录
let courseList = [
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
  },
  {
    'id': 31,
    'type': 1,
    'name': '你的大学',
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
      'data': courseList
    }
  }
}
export const coursesDetail = req => {
  if (req.type === 'DELETE') {
    courseList.forEach((item, index) => {
      if (item.id === 29) {
        courseList.splice(index, 1)
      }
    })
    return {
      'sysCode': 1000,
      'msg': '删除课程成功',
      'data': null
    }
  } else {
    return {
      'sysCode': 1000,
      'msg': '查询课程列表成功',
      'data': {
        'id': 30,
        'type': 1,
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
}
let comments = [
  {
    'id': 1,
    'platForm': 2,
    'content': '课真好啊',
    'createTime': '2019-09-26T14:37:09.505Z',
    'title': '剑少课程111',
    'nickName': '小石头',
    'order': 0,
    'isOpen': true
  },
  {
    'id': 2,
    'platForm': 1,
    'content': '课不好',
    'createTime': '2019-09-26T14:37:09.505Z',
    'title': '华清园',
    'nickName': '小老虎',
    'order': 1,
    'isOpen': false
  }
]
export const commentList = req => {
  if (req.type === 'GET') {
    return {
      'sysCode': 1000,
      'msg': '查询评论成功',
      'data': comments
    }
  } else if (req.type === 'POST') {
    let params = JSON.parse(req.body)
    comments.push({
      'id': 3,
      'platForm': 2,
      'content': params['content'],
      'createTime': params['createTime'],
      'title': '华清园',
      'nickName': '小鸟',
      'order': 2,
      'isOpen': false
    })
  }
}
export const commentDetail = req => {
  let data = comments.filter(item => {
    return item.id === 1
  })[0]
  return {
    'sysCode': 1000,
    'msg': '查询评论成功',
    'data': data
  }
}
