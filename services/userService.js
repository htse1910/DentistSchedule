import { where } from "sequelize";
import db from "../models/index";
import bcrypt, { hash } from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

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

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exist

                let user = await db.User.findOne({
                    attributes: ['email', 'roleID', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });

                if (user) {
                    //compare password
                    let check = bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'ok';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'User not found'
                }
            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = "Your email isn't exist in our system. Please try another email. "

            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

let compareUserPassword = () => {
    return new Promise((resolve, reject) => {
        try {

        } catch (e) {
            reject(e);
        }
    })
}



let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId }
                })
            }
            resolve(users)
        } catch (e) {
            reject(e);
        }
    })
}


let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in use. Please try another email!'
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    message: 'User creation succeeded!'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let foundUser = await db.User.findOne({
                where: { id: userId }
            });

            if (!foundUser) {
                resolve({
                    errCode: 2,
                    errMessage: `The user doesn't exist`
                });
                return;
            }

            await db.User.destroy({
                where: { id: userId }
            });

            resolve({
                errCode: 0,
                errMessage: `The user is deleted!`
            });
        } catch (error) {
            reject(error);
        }
    });
};

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                });
            } else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false
                });

                if (user) {
                    user.firstName = data.firstName;
                    user.lastName = data.lastName;
                    user.address = data.address;
                    user.roleId = data.roleId;
                    user.positionId = data.positionId;
                    user.gender = data.gender;
                    user.phonenumber = data.phonenumber;
                    if(data.avatar) {
                        user.image = data.avatar;
                    }
                    await user.save(); // Lưu các thay đổi vào cơ sở dữ liệu

                    resolve({
                        errCode: 0,
                        message: 'Update the user succeed!'
                    });
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: `User's not found`
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService
}