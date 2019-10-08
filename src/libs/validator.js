export default {
  isRequired (type = 'string') {
    return { required: true, type, message: '此项不能为空', trigger: 'blur' }
  },
  isNumber () {
    return {
      validator: (r, v, cb) => {
        if (v && !/^\d+$/.test(v)) cb(new Error('数值格式不对'))
        cb()
      },
      trigger: 'blur'
    }
  },
  isPhone () {
    return {
      validator: (r, v, cb) => {
        if (v && !/^1\d{10}$/.test(v)) cb(new Error('号码格式不对'))
        cb()
      },
      trigger: 'blur'
    }
  },
  isIDCard () {
    return {
      validator: (r, v, cb) => {
        if (!/^\d/.test(v)) cb(new Error('格式不对'))
        cb()
      },
      trigger: 'blur'
    }
  }
}
