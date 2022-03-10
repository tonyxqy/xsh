const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        minlength:2,
        maxlength:10
    },
    num: {
        type:String,
        unique:true
    },
    Password:{
        type:String,
        require:true
    },
    division:{
        type:String
    },
    role:{
        type:String,
        required:true
    },
    state: {
        type:Number,
        default:0
    }
});
const User = mongoose.model('User',userSchema);

const Joi = require('joi');
const validateUser = user =>{
    const schema = {
        username: Joi.string().min(2).max(10).required().error(new Error('用户名没有通过验证')),
        num: Joi.string().min(7).max(9).required().error(new Error('您输入的是啥呀')),
        division: Joi.string().valid('人事管理部','外联部','学术部','信息部','权益部','文体部','辅导员','学生会主席团').required().error(new Error('部门非法')),
        Password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required().error(new Error('密码格式不符合要求')),
		role: Joi.string().valid('normal', 'admin').required().error(new Error('角色值非法')),
		state: Joi.number().valid(0, 1).required().error(new Error('状态值非法'))
    }
    return Joi.validate(user,schema);
}

module.exports = {
    User:User,
    validateUser:validateUser
}