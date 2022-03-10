// 引入mongoose第三方模块
const mongoose = require('mongoose');
// // 导入config模块
// const env = process.env.NODE_ENV || 'development'
// const credentials = require(`../.credentials.${env}`)
// const {connectionString} = credentials.mongo
// if(!connectionString){
// 	console.error('MongoDB connection string missing!');
// 	process.exit(1);
// }
// 连接数据库
// 'mongodb://localhost/renshi'
// console.log(connectionString);
mongoose.connect('mongodb://localhost/renshi', {useNewUrlParser: true })
	.then(() => console.log('数据库连接成功'))
	.catch(error => {console.log('数据库连接失败')
		console.log(error);
})