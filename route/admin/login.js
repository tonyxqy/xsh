const {User} = require('../../model/user');
module.exports  = async(req,res)=>{
    // 接受请求参数
    const{num,password} = req.body;
    if(num.trim().length==0){
        return res.status(400).render('admin/error',{msg:'学号或密码错误'});
    }
    if(password.trim().length==0){
        return res.status(400).render('admin/error',{msg:'学号或密码错误'});
    }
    // 如果查询到用户user变量的值为对象,反之为空

    // 根据学号查询用户信息
    let user = await User.findOne({num:num});
    if(user){
        if(password == user.Password){
            // 使用session
            req.session.username = user.username;
            // 删除session的方法
            // req.session.username = null;
            // delete req.session.username;
            req.app.locals.userInfo = user;
            res.redirect('/admin/user');
        }else{
            return res.status(400).render('admin/error',{msg:'学号或密码错误'});
        }
    }else{
        return res.status(400).render('admin/error',{msg:'学号或密码错误'});
    }
}
