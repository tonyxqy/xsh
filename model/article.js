// 引用猫鼬模块
const mongoose = require('mongoose');
// 创建数据模板
const articleSchema = new mongoose.Schema({
    title:{
        type:String,
        require:[true,'请填写会议主题'],
        minlength:2,
        maxlength:20
    },
    author: {
        type:String,
    },
    publishDate:{
        type:Date,
        default:Date.now()
    },
    present:{
        type:String
    },
    absent:{
        type:String
    },
    leave:{
        type:String
    },
    cover:{
        type:String,
        default:null
    },
    content:{
        type:String
    },
    division:{
        type:String
    }
});
// 根据模板创建实例
const Article = mongoose.model('Article',articleSchema);
// 模块导出
module.exports = {
   Article:Article
}