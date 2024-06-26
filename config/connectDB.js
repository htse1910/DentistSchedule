// Import Sequelize
const { Sequelize } = require('sequelize');

// Khởi tạo Sequelize instance
const sequelize = new Sequelize('swp301', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

// Hàm kết nối đến cơ sở dữ liệu
let connectDB = async () => {
    try {
        // Thử kết nối đến cơ sở dữ liệu
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        // Xử lý lỗi nếu không thể kết nối đến cơ sở dữ liệu
        console.error('Unable to connect to the database:', error);
    }
}

// Xuất hàm connectDB để có thể import và sử dụng trong các module khác
module.exports = connectDB;
