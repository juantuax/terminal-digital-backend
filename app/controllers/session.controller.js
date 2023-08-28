const db = require("../models");
const constants = require("../resources/constants");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const Session = db.session;
const User = db.users;


// get all sessions
exports.GetAllSessions = async (req, res) => {
    await Session.findAll({include: ['User']})
        .then(data => {
            if (data === null) {
                res.status(404).send({
                    success: 'true',
                    statusCode: 404,
                    data: null,
                    message: constants.ADMINISTRATORS_NOT_FOUND
                });
            } else {
                res.status(200).send({
                    success: 'true',
                    statusCode: 200,
                    data: data,
                    message: constants.ADMINISTRATORS_FOUND
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 'false',
                statusCode: 500,
                data: err,
                message: constants.ADMINISTRATORS_NOT_FOUND
            });
        });
};

// // get one administrator
// exports.GetOneAdmin = async (req, res) => {
//     const id = req.params.id;
//     await Admin.findOne({ where: { id: id }, include: ['User'] })
//         .then(data => {
//             if (data === null) {
//                 res.status(404).send({
//                     success: 'true',
//                     statusCode: 404,
//                     data: null,
//                     message: constants.ADMINISTRATOR_NOT_FOUND
//                 });
//             } else {
//                 res.status(200).send({
//                     success: 'true',
//                     statusCode: 200,
//                     data: data,
//                     message: constants.ADMINISTRATOR_FOUND
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 success: 'false',
//                 statusCode: 500,
//                 data: err,
//                 message: constants.ADMINISTRATOR_NOT_FOUND
//             });
//         });
// };

// // get administrator profile 
// exports.GetAdminProfile = async (req, res) => {
//     const id = req.params.id;
//     await Admin.findOne({ where: { UserId: id }, include: ['User'] })
//         .then(data => {
//             if (data === null) {
//                 res.status(404).send({
//                     success: 'true',
//                     statusCode: 404,
//                     data: null,
//                     message: constants.ADMINISTRATOR_NOT_FOUND
//                 });
//             } else {
//                 res.status(200).send({
//                     success: 'true',
//                     statusCode: 200,
//                     data: data,
//                     message: constants.ADMINISTRATOR_FOUND
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 success: 'false',
//                 statusCode: 500,
//                 data: err,
//                 message: constants.ADMINISTRATOR_NOT_FOUND
//             });
//         });
// };

// // update Admin 
// exports.UpdateAdmin = async (req, res) => {
//     const id = req.params.id;
//     const password = req.body.password;
//     const username = req.body.username;
//     const fullname = req.body.fullname;
//     const companyNumber =  req.body.companyNumber; 
//     const phone= req.body.phone;
//     const contact= req.body.contact;
//     const address= req.body.address; 
//     const latitude = req.body.latitude;
//     const longitude = req.body.longitude
//     const userId = req.body.userId;
//     const salt = await bcrypt.genSalt(10);
//     const passHash = await bcrypt.hash(password, salt);
//     const picture = req.body.picture;

//     const result = await User.findOne({ where: { [Op.and]: [{ username: { [Op.eq]: username } }, { id: { [Op.ne]: userId } }] } })
//         .then(data => {
//             if (data !== null) {
//                 return true;
//             }
//             return false;
//         })
//         .catch(err => {
//             return false;
//         });

//     if (result !== false) {
//         return res.status(409).send({
//             success: 'true',
//             statusCode: 409,
//             data: null,
//             message: constants.ALREADY_REGISTERED
//         });
//     }
//     if (picture !== '') {
//         await Picture.findOne({ where: { UserId: userId } })
//             .then(async data => {
//                 if (data !== null) {
//                     await Picture.update({ path: picture }, { where: { UserId: userId } });
//                     req.io.emit('picture_update', `${userId}`);
//                 } else {
//                     await Picture.create({ path: picture, UserId: userId });
//                     req.io.emit('picture_update', `${userId}`);
//                 }
//             })
//             .catch(err => {
//                 res.status(500).send({
//                     success: 'false',
//                     statusCode: 500,
//                     data: err,
//                     message: constants.FAIL_UPDATE_ADMINISTRATOR
//                 });
//             });
//     }
//     await Admin.update({ companyNumber: companyNumber, fullname: fullname, phone: phone, contact: contact, address: address, latitude:latitude,longitude:longitude }, { where: { id: id } })
//         .then(async data => {
//             if (password != "") {
//                 await User.update({ username: username, password: passHash }, { where: { id: userId } })
//                     .then(data => {
                       
//                         res.status(200).send({
//                             success: 'true',
//                             statusCode: 200,
//                             data: data,
//                             message: constants.SUCCESS_UPDATE_ADMINISTRATOR
//                         });
//                     })
//                     .catch(err => {
//                         res.status(500).send({
//                             success: 'false',
//                             statusCode: 501,
//                             data: data,
//                             message: constants.FAIL_UPDATE_ADMINISTRATOR
//                         });
//                     });
//             } else {
//                 await User.update({ username: username }, { where: { id: userId } })
//                 .then(data => {
//                     res.status(200).send({
//                         success: 'true',
//                         statusCode: 200,
//                         data: data,
//                         message: constants.SUCCESS_UPDATE_ADMINISTRATOR
//                     });
//                 })
//                 .catch(err => {
//                     res.status(500).send({
//                         success: 'false',
//                         statusCode: 502,
//                         data: data,
//                         message: constants.FAIL_UPDATE_ADMINISTRATOR
//                     });
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 success: 'false',
//                 statusCode: 500,
//                 data: err,
//                 message: constants.FAIL_UPDATE_ADMINISTRATOR
//             });
//         });
// };

// //delete admin  
// exports.DeleteAdmin = async (req, res) => {
//     const id = req.params.id;
//     await User.update({active: 0},{ where: { id: id } })
//         .then(() => {
//             res.status(200).send({
//                 success: 'true',
//                 statusCode: 200,
//                 data: null,
//                 message: constants.SUCCESS_DELETE_ADMINISTRATOR
//             });
//         })
//         .catch(err => {
//             res.status(500).send({
//                 success: 'false',
//                 statusCode: 500,
//                 data: err,
//                 message: constants.FAIL_DELETE_ADMINISTRATOR
//             });
//         });
// };
// // get companies related 
// exports.GetAdminUnities = async (req, res) => {
//     const admin = req.params.id;
//     await AdminUnity.findAll({
//         where: { AdminId: admin }, include: ["Unity"]
//     })
//         .then(data => {
//             if (data.length <= 0) {
//                 res.status(404).send({
//                     success: 'true',
//                     statusCode: 404,
//                     data: null,
//                     message: constants.COMPANIES_NOT_FOUND
//                 });
//             } else {
//                 res.status(200).send({
//                     success: 'true',
//                     statusCode: 200,
//                     data: data,
//                     message: constants.COMPANIES_FOUND
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 success: 'false',
//                 statusCode: 500,
//                 data: err,
//                 message: constants.COMPANIES_NOT_FOUND
//             });
//         });
// }
// //delete relationship admin-company
// exports.DeleteAdminCompanies = async (req, res) => {
//     const admin = req.params.id;
//     const company = req.body.company;
//     await AdminUnity.destroy({ where: { [Op.and]: [{ AdminId: admin, UnityId: company }] } })
//         .then(() => {
//             res.status(200).send({
//                 success: 'true',
//                 statusCode: 200,
//                 data: null,
//                 message: constants.SUCCESS_DELETE_COMPANY
//             });
//         })
//         .catch(err => {
//             res.status(500).send({
//                 success: 'false',
//                 statusCode: 500,
//                 data: err,
//                 message: constants.FAIL_DELETE_COMPANY
//             });
//         });

// }