const mongoose = require('mongoose');
// 创建集合规则
const volenteerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 20
	},
	teacher: {
		type: String,
	},
	place: {
		type: String,
		minlength: 2,
		maxlength: 20
	},
	welfare: [ String ],
	division: String,
	enterDate: {
		type: Date,
		default: Date.now
	},
	endDate: {
		type: Date,
		default: Date.now
	},
	vol: [String]
});
// 信息集合
const Volenteer = mongoose.model('volenteer', volenteerSchema);
// 将信息集合进行导出
module.exports = {
    Volenteer:Volenteer,
};