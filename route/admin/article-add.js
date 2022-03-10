const path = require('path');
const formidable = require('formidable');
const {Article} = require('../../model/article')
module.exports = (req,res)=>{
    const form = new formidable.IncomingForm();
	// 2.配置上传文件的存放位置
	form.uploadDir = path.join(__dirname, '../', '../','public', 'upload');
	// 3.保留上传文件的后缀
	form.keepExtensions = true;
	// 4.解析表单
	form.parse(req, async(err, fields, files) => {
		await Article.create({
			title:fields.title,
			author:fields.author,
			publishDate:fields.publishDate,
			present:fields.present,
			absent:fields.absent,
			leave:fields.leave,
			cover:files.cover.path.split('public')[1],
			content:fields.content,
			division:fields.division
		});
		res.redirect('/admin/article');
	})
}