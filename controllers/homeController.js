import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
};

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    try {
        console.log('Request body:', req.body);  // Kiểm tra dữ liệu trong request body
        let message = await CRUDService.createNewUser(req.body);
        console.log(message);
        return res.send('Post CRUD from server!');
    } catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render('displayCRUD.ejs', {
        dataTable: data
    })
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        return res.render('editCRUD.ejs', {
            user: userData
        });
    } else {
        return res.send('User not found');
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUsers
    });
}

let deleteCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        try {
            await CRUDService.deleteUserById(userId); // Gọi hàm deleteUserById từ CRUDService
            return res.send('Delete user succeed!')
        } catch (e) {
            console.error(e);
            return res.status(500).send('Internal Server Error');
        }
    } else {
        return res.send('User not found!')
    }
}
module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}
