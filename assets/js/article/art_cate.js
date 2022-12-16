$(function () {
    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                // 这里使用第三方 template 模板字符串
                // var htmlStr = template('tpl-table', res)
                // $('tbody').html(htmlStr)


                // 1. 声明一个字符串变量
                let str = ''
                // 2. 遍历数据 
                res.data.forEach(item => {
                    const { name, alias, Id } = item
                    str += `
                    <tr>
                    <td>${name}</td>
                    <td>${alias}</td>
                    <td>
                    <button type="button" class="layui-btn layui-btn-xs btn-edit" data-id=${Id}>编辑</button>
                    <button type="button" class="layui-btn layui-btn-danger layui-btn-xs btn-delete" data-id=${Id}>删除</button>
                    </td>
                </tr>
                    `
                })
                // 3.生成的 字符串 添加给 tbody
                $('tbody').html(str)
            }
        })
    }

    // 使用 layui 弹出层
    let layer = layui.layer
    // 定义一个变量获取 layer.open() 的索引 index
    let indexAdd = null
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        // 在按钮的点击事件中，通过 `layer.open()` 展示弹出层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // 发起 ajax 请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                // 添加成功，重新渲染页面
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据 layer.open 索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })



    // 为编辑按钮添加点击事件
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        let id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        let form = layui.form
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res.data.name);
                // layui 方法向 input 框输入内容
                form.val('form-edit', res.data)


                // 在使用第三方框架时，原生的js方法包括jq就不适用了，适应框架提供的方法来做 // $('**').val(res.data.name)
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                // 重新渲染数据
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 5, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    // 重新渲染数据
                    initArtCateList()
                }
            })
        })
    })
})