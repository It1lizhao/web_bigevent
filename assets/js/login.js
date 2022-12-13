$(function () {
    // 点击 去注册账号 的链接事件
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击 去登陆 的链接事件
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从 layui 中获取 from 对象
    let form = layui.form
    // layui 的弹出框对象
    let layer = layui.layer

    // 校验登录密码
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则  return 一个提示消息即可
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) { return '两次密码不一致' }
        }
    })


    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        let date = {
            username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', date, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            } else {
                layer.msg('注册成功请登录！')
                // 注册成功后跳转到登录界面
                $('#link_login').click()
            }
        })
    })


    // 监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        // 阻止表单默认事件
        e.preventDefault()

        // 发起ajax请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                } else {
                    layer.msg('登录成功！')
                    // 将登录成功得到的 token 字符串，保存到 localStorage 中
                    localStorage.setItem('token', res.token)
                    // 登录成功后跳转到后台主页
                    location.href = '/index.html'
                }
            }

        })
    })
})