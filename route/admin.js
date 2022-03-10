// 管理程序路由
// 引用express框架
const express = require('express');
// 创建路由edit
const admin = express.Router();

const fs = require('fs');
// 获取数据库集合
const {User} = require('../model/user');
const {Volenteer} = require('../model/volenteer');
const { Article } = require('../model/article');
const { Audio } = require('../model/audiomessage');

admin.get('/',(req,res)=>{
    res.render('admin/login');
});
admin.get('/login',(req,res)=>{
    res.render('admin/login');
});
admin.get('/user',async(req,res)=>{
    req.app.locals.currentLink = 'user';
    let users = await pagination(User).find().page(1).size(10).display(3).exec();
    res.render('admin/user',{
        users:users,
    });
});
admin.get('/user-edit',async(req,res)=>{
    const {message,id} = req.query;
    if(id){
       let user =await User.findOne({_id:id});
       res.render('admin/user-edit',{
           message:message,
           user:user,
           link:'/admin/user-modify?id='+id,
            button:"修改"

        });
    }else{
        res.render('admin/user-edit',{
            message:message,
            link:'/admin/user-edit',
            button:"提交"
        });
    }
});
admin.get('/list-edit',async(req,res)=>{
        res.render('admin/list-edit');
});
// 文章列表页面组由
admin.get('/article-edit',async(req,res)=>{
    const {message,id} = req.query;
    if(id){
       let article =await Article.findOne({_id:id});
       res.render('admin/article-edit',{
           message:message,
           article:article,
           link:'/admin/article-modify?id='+id,
           button:"修改"

        });
        console.log(article.content);
    }else{
        res.render('admin/article-edit',{
            message:message,
            link:'/admin/article-add',
            button:"提交"
        });
    }
});
admin.get('/list',async(req,res)=>{
    req.app.locals.currentLink ='volenteer';
    let volenteers = await Volenteer.find();
    volenteers = JSON.stringify(volenteers);
    volenteers = JSON.parse(volenteers);
    res.render('admin/list',{
        volenteers
    });
});
admin.get('/delete',async(req,res)=>{
    await User.findOneAndDelete({_id:req.query.id});
    res.redirect('/admin/user');      
});
admin.get('/delete-article',async(req,res)=>{
    await Article.findOneAndDelete({_id:req.query.id});
    res.redirect('/admin/article');      
});
admin.get('/audio',(req,res)=>{
    res.render('admin/demo1');
});
const pagination = require('mongoose-sex-page');
// 文章列表页面组由
admin.get('/article',async(req,res)=>{
    req.app.locals.currentLink = 'article';
    let articles = await pagination(Article).find().page(1).size(10).display(3).exec();
    res.render('admin/article',{
        articles:articles
    });
});
// 实现登录工作
admin.post('/login',require('./admin/login'));
// 实现添加用户操作
admin.post('/user-edit',require('./admin/user-edit-fn'));
admin.post('/user-modify',async(req,res,next)=>{
    const body = req.body;
    const id = req.query.id;
    let user = await User.findOne({_id:id});
    if(user.Password==body.Password){
       await User.updateOne({_id:id},{
        username:req.body.username,
        num:req.body.num,
        division:req.body.division,
        role:req.body.role,
        state:req.body.state
       });
       res.redirect('/admin/user');      
    }else{
        next(JSON.stringify({path:'/admin/user-edit',message:'密码比对失败,不允许修改',id:id}))
    }
});
admin.post('/article-modify',async(req,res)=>{
    const id = req.query.id;
       await Article.updateOne({_id:id},{
        title:req.body.title,
        author:req.body.author,
        publishDate:req.body.publishDate,
        present:req.body.present,
        absent:req.body.absent,
        leave:req.body.leave,
        cover:req.body.cover,
        content:req.body.content,
        division:req.body.division
       });
       res.redirect('/admin/article');      
});
admin.post('/list-add',async(req,res)=>{
  await Volenteer.create(req.body);
  res.redirect('/admin/list');  
});
admin.post('/uploadWords',async(req,res)=>{
    audioSentense = JSON.parse(req.body.sentense);
    Object.getOwnPropertyNames(audioSentense).forEach(function(key){
        console.log(key+ '---'+typeof(audioSentense[key]))
    })
    await Audio.create({
        articleName:req.body.articleName,
        slice_type:audioSentense.slice_type,
        index:audioSentense.index,
        start_time:audioSentense.start_time,
        end_time:audioSentense.end_time,
        voice_text_str:audioSentense.voice_text_str,
        word_size:audioSentense.word_size,
        word_list:audioSentense.word_list,
        voice_id:audioSentense.voice_id
    });

    fs.writeFile('./message.txt', req.body.article,function(err){
        if(err) console.log('写文件操作失败');
        else console.log('写文件操作成功');
    });
    let runPy = new Promise(function(success, nosuccess) {
        const { spawn } = require('child_process');
        
        const pyprog = spawn('python', ['./tmp.py']);       
            pyprog.stdout.on('data', function(data) {
            success(data);
            });       
            pyprog.stderr.on('data', (data) => {
            nosuccess(data);
            });
        });
        runPy.then(function(testMLFunction) {
            console.log(testMLFunction.toString());           
            res.end(testMLFunction);     
        });
 res.send(
     {
         message:`have got the data `,
         data:req.body.sentense
     }
 )
});

admin.post('/treeShow',(req,res)=>{
    data = {
      "downward": {
                    "direction": "downward",
                    "name": "origin",
                    "children": [
                                    {
                                        "name": "故事",
                                        "detail": "冈萨雷斯的糖果",
                                        "logic": "开场白",
                                        "hasHumanholding":true,
                                        "hasChildren":true,
                                        "isExpand": true,
                                        "children": [
                                            {
                                                "name": "主旨",
                                                "hasHumanholding":false,
                                                "hasChildren":true,
                                                "detail": "生命是那么甜蜜，就像糖果。但生命终会流逝，就像糖果总会被人拿走。但最重要的是不管发生什么，爱他的人，总会让他一次次重生。",
                                                "logic": "深入",
                                                "children": []
                                            }
                                        ]
                                    },
                                    {
                                        "name": "现实",
                                        "detail": "用故事联系到武汉人",
                                        "logic": "开场白",
                                        "hasHumanholding":true,
                                        "hasChildren":true,
                                        "isExpand": false,
                                        "children": [
                                            {
                                                "name": "细节",
                                                "hasHumanholding":false,
                                                "hasChildren":true,
                                                "detail": "过去一年间武汉人所经历的那些美好、流逝和重生，也见证了爱的力量。",
                                                "logic": "深入",
                                                "children": []
                                            },
                                        ]
                                    },
                                    {
                                        "name": "回顾今年",
                                        "detail": "从武汉疫情总结今年-不容易",
                                        "logic": "主题1",
                                        "hasHumanholding":true,
                                        "hasChildren":true,
                                        "isExpand": false,
                                        "children": [
                                            {
                                                "name": "需要确定性",
                                                "hasHumanholding":false,
                                                "hasChildren":true,
                                                "detail": "一定要办线下演讲",
                                                "logic": "分论点",
                                                "children": []
                                            },
                                            {
                                                "name": "感谢观众",
                                                "hasHumanholding":false,
                                                "hasChildren":true,
                                                "detail": "………………",
                                                "logic": "深入",
                                                "children": [ {
                                                    "name": "拓展",
                                                    "hasHumanholding":false,
                                                    "hasChildren":true,
                                                    "detail": "躬身入局",
                                                    "logic": "深入",
                                                    "children": []
                                                }]
                                            }
                                        ]
                                    }
                                ]
                    }
      }
      jsonData=JSON.stringify(data);
      fs.writeFile('./output.json',jsonData,function(err){
        if(err) console.log('写文件操作失败');
        else console.log('写文件操作成功');
    });
    res.send(jsonData);
});
admin.post('/article-add',require('./admin/article-add'));
// 将路由对象作为模块成员进行导出
module.exports = admin;