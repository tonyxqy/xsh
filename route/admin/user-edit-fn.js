const {User,validateUser} = require('../../model/user');
module.exports = async(req,res,next)=>{
    try {
        await validateUser(req.body);
    }
    catch (e){
        // return res.redirect(`/admin/user-edit?message=${e.message}`);
        return next(JSON.stringify({path:'/admin/user-edit',message:e.message}));
    }
    let user = await User.findOne({num:req.body.num});
    if(user){
        return res.redirect(`/admin/user-edit?message=您已经使用该学号注册过了,如果忘记密码请联系管理员`);
    } 
    await User.create(req.body);
    res.redirect('/admin/user');
}