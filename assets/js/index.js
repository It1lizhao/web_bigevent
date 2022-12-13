$(function () {
    // 调用 getUserInfo 获取用户基本信息
    getUserInfo()
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // Headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            } else {
                // 调用 renderAvatar 渲染用户的头像
                renderAvatar(res.data)
            }
        },
        // 不论成功还是失败，最终都会调用 complete 回调函数
        // 放到 baseAPI 全局使用
        // complete: function (res) {
        //     // console.log('执行了 complete 回调：')
        //     // console.log(res)
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1. 强制清空 token
        //         localStorage.removeItem('token')
        //         // 2. 强制跳转到登录页面
        //         location.href = '/大事件后台管理/login.html'
        //     }
        // }
    })
}

function renderAvatar(user) {
    // 1. 获取用户的名称
    let name = user.nickname || user.username
    // 2. 设置欢迎的文本
    $('#welcome').html(`欢迎&nbsp;&nbsp;${name}`)
    // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img')
            .attr('src', user.user_pic)
            .show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        // 拿到用户的名字的第一个字母，并转换成大写
        let first = name[0].toUpperCase()
        $('.text-avatar')
            .html(first)
            .show()
    }
}

let layer = layui.layer

// 点击按钮，实现退出功能
$('#btnLogout').on('click', function () {
    // 提示用户是否确认退出
    layer.confirm('确定退出登录?', { icon: 5, title: '提示' }, function (index) {
        //do something
        // 1. 清空本地存储中的 token
        localStorage.removeItem('token')
        // 2. 重新跳转到登录页面
        location.href = '/大事件后台管理/login.html'

        // 关闭 confirm 询问框
        layer.close(index)
    })
})