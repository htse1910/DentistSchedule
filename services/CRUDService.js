import bcrypt from 'bcryptjs';
import db from '../models/index';
import { DataTypes } from 'sequelize';

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Data received:', data);  // Kiểm tra dữ liệu nhận được
            let hashPasswordFromBcrypt = await hashUserPassword(data.inputPassword); // Sử dụng đúng tên trường
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.Address, // Sử dụng đúng tên trường
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                image: data.image,  // Đảm bảo rằng trường này khớp với tên trong request body
                roleId: data.roleId,
            });
            resolve('Create a new user succeed!');
        } catch (e) {
            reject(e);
        }
    });
}

let hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            console.log('Password to hash:', password);  // Kiểm tra password nhận được
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
}

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}

let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            });
            if (user) {
                resolve(user);
            } else {
                resolve({});
            }
        } catch (e) {
            reject(e);
        }
    });
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            } else {
                resolve();
            }

        } catch (e) {
            console.log(e);
        }
    }
    );
}

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (user) {
                await user.destroy();
            }
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
}
