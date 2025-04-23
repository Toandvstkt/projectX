const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		console.log("📡 Đang kết nối đến:", process.env.CONN_STR);
		const conn = await mongoose.connect(process.env.CONN_STR);
		console.log(`✅ Kết nối thành công! Máy chủ: ${conn.connection.host} - Database: ${conn.connection.name}`);
	} catch (error) {
		console.error("❌ Lỗi kết nối MongoDB:", error);
		process.exit(1);
	}
};

module.exports = connectDB;
