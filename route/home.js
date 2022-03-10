// 引用express框架
const express = require('express');
// 创建路由
const home = express.Router();

home.get('/',(req,res)=>{
    res.send('欢迎访问上海大学计算机学院');
});

// 将路由对象作为模块成员进行导出
module.exports = home;