// 注意修改了art-templte模块的规则，服务端仅能使用{{}}语法
// 修改位置在compile文件夹下的default.JS

// 引用express框架
const express = require('express');

// 创建网站服务器
const app = express();
// 数据库连接
require('./model/connect');
// 规避同源策略
const cors = require('cors');
app.use(cors());

// 引用路径模块
const path = require('path');

// 静态资源访问，使用static中间件使得位于public内的静态资源无条件开放
// -------------------------------
// 开放静态资源文件-express，path
app.use(express.static(path.join(__dirname,'public')));
// -------------------------------


// 引入body-Parser
// -----------------------------------
// 借此可以使用req.body方法
const bodyParser = require('body-parser');
// 处理post参数
app.use(bodyParser.urlencoded({extended:false}))
// -----------------------------------

// 本地存储模块
// --------------------------------------
// 导入cookie模块中间件
// 引入cookie密钥以保证cookie安全性
const {credentials} = require('./config');
const cookieParser = require('cookie-parser');
app.use(cookieParser(credentials.cookieSecret))
// 导入session模块中间件
// session实现内存存储
const session = require('express-session');
app.use(session({secret:'secret key'}));
// ---------------------------------------

// express框架下模板引擎，express-art-template
// ------------------------------
// 告诉框架模板所在位置
app.set('views',path.join(__dirname,'views'));
// 告诉模板默认后缀是
app.set('view engine','art');
// 当渲染后缀为art时,使用的模板引擎
app.engine('art',require('express-art-template'));
// -------------------------------

// 引入模板引擎，此模板引擎仅用于事件处理
// --------------------------------
const template = require('art-template');
// 引入dateformate 对时间归一化处理
const dateFormat = require('dateformat');
template.defaults.imports.dateFormat = dateFormat;
// --------------------------------

// 路由功能构建
// =================================
// app.METHOD路由处理函数
// 接收路径作为第一个参数
app.get('/',(req,res)=>{
    res.render('admin/login');
});
// 引入路由模块
const home = require('./route/home');
const admin = require('./route/admin');
const { nextTick } = require('process');
// const { template } = require('express-art-template');

// 拦截请求
// 在没有登录之前全部拦截至登录界面
// 中间件可以接收一个路径作为第一个参数，但是这是可选的，如果略去就相当于*匹配所有路径
app.use('/admin',require('./middleware/loginGuard'));

//为路由匹配请求路径
app.use('/home',home);
app.use('/admin',admin);
// ==================================

// 错误处理中间件
// -------------------------------------
app.use((err,req,res,next)=>{
    const result = JSON.parse(err);
    let params = [];
    for(let attr in result){
        if(attr != 'path'){
        params.push(attr + '=' +result[attr]);
        }
    } 
    res.redirect(`${result.path}?${params.join('&')}`);
})
// -------------------------------------


// 监听端口
app.listen(3000);
console.log('网站服务器启动成功，请访问localhoast');