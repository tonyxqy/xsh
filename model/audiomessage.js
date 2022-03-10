const mongoose = require('mongoose');
// 创建数据模板
const audioSchema = new mongoose.Schema({
    user:String,
    slice_type:{
        type:Number,
    },
    index: {
        type:Number,
    },
    start_time:{
        type:Number,
    },
    end_time:{
        type:Number,
    },
    voice_text_str:{
        type:String,
    },
    word_size:{
        type:Number,
    },
    word_list:[{end_time: Number,stable_flag:Number,start_time:Number,word:String}],
    voice_id:{
        type:String
    }
});
// 根据模板创建实例
const Audio = mongoose.model('Audio',audioSchema);
// 模块导出
module.exports = {
    Audio:Audio
}




