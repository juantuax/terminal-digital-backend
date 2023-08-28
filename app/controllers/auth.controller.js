const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const constants = require("../resources/constants");
var o2x = require("object-to-xml");
const moment = require("moment");
const User = db.users;
const Session = db.session;
const Driver = db.driver;
const Admin = db.admin;
const AdminCompany = db.adminCompany;
const Root = db.root;
const Picture = db.picture;
const Helper = db.helper;
const accessTokenSecret =
  "fbqipunsjhdmrxniyktruabbomuposoohgaafetqkqhctzkugqasaxvathgvcbtqwlmtmtcagzcrihkmoswbnxwzbcoexcltrvvaiwpjnckqsoklqwllnexwvlqnsjbftckrzibilxhtxkdzpkszixawwrrjhtye";

// LogIn Method
exports.SignIn = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!(username && password)) {
    return res.status(400).send({
      success: "false",
      statusCode: 400,
      data: null,
      message: constants.EMPTY_DATA,
    });
  }

  User.findOne({ where: { username: username } })
    .then(async (data) => {
      const validPassword = await bcrypt.compare(password, data.password);
      if (validPassword) {
        // const logged = await Session.findOne({ where: { UserId: data.id } })
        //     .then(loggedData => {
        //         if (loggedData !== null) {
        //             return false;
        //         } else {
        //             return true;
        //         }

        //     })
        //     .catch(() => {
        //         res.status(500).send({
        //             success: 'false',
        //             statusCode: 500,
        //             data: err,
        //             message: constants.FAIL_REGISTER_TOKEN
        //         });
        //     });
        // if (!logged) {
        //     return res.status(409).send({
        //         success: 'false',
        //         statusCode: 409,
        //         data: null,
        //         message: constants.EMPTY_DATA
        //     });
        // }
        if (data.active === 0) {
          return res.status(403).send({
            success: "true",
            statusCode: 400,
            data: data,
            message: constants.NOT_VERIFIED,
          });
        }

        const accessToken = jwt.sign(
          { id: data.id, username: data.username, rol: data.rol },
          accessTokenSecret
        );
        Session.create({ sessionToken: accessToken, UserId: data.id })
          .then((sessionData) => {
            res.status(200).send({
              success: "true",
              statusCode: 200,
              data: {
                token: accessToken,
                userData: {
                  id: data.id,
                  username: data.username,
                  token: data.notificationToken,
                  role: data.rol,
                },
              },
              message: constants.SUCCESS_LOGIN,
            });
          })
          .catch((err) => {
            res.status(500).send({
              success: "false",
              statusCode: 500,
              data: err,
              message: constants.FAIL_REGISTER_TOKEN,
            });
          });
      } else {
        res.status(401).send({
          success: "true",
          statusCode: 401,
          data: data,
          message: constants.PASSWORD_NOT_MATCH,
        });
      }
    })
    .catch((err) => {
      res.status(404).send({
        success: "false",
        statusCode: 404,
        data: err,
        message: constants.USER_NOT_FOUND,
      });
    });
};

// LogIn Phone Method
exports.SignInPhone = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!(username && password)) {
    return res.status(400).send({
      success: "false",
      statusCode: 400,
      data: null,
      message: constants.EMPTY_DATA,
    });
  }

  User.findOne({ where: { username: username } })
    .then(async (data) => {
      if (data !== null) {
        const validPassword = await bcrypt.compare(password, data.password);
        if (validPassword) {
          const logged = await Session.findOne({ where: { UserId: data.id } })
            .then((loggedData) => {
              if (loggedData === null) {
                return null;
              } else {
                return loggedData;
              }
            })
            .catch(() => {
              return res.status(500).send({
                success: "false",
                statusCode: 500,
                data: err,
                message: constants.FAIL_REGISTER_TOKEN,
              });
            });

          if (logged !== null) {
            return res.status(409).send({
              success: "false",
              statusCode: 409,
              data: logged,
              message: constants.EMPTY_DATA,
            });
          }

          const accessToken = jwt.sign(
            { id: data.id, username: data.username, rol: data.rol },
            accessTokenSecret
          );
          Session.create({ sessionToken: accessToken, UserId: data.id })
            .then(async (sessionData) => {
              const profile = await Driver.findOne({
                where: { UserId: data.id },
              });
              return res.status(200).send({
                success: "true",
                statusCode: 200,
                data: {
                  token: accessToken,
                  userData: {
                    id: data.id,
                    username: data.username,
                    token: data.notificationToken,
                    role: data.rol,
                    profile: profile,
                  },
                },
                message: constants.SUCCESS_LOGIN,
              });
            })
            .catch((err) => {
              return res.status(500).send({
                success: "false",
                statusCode: 500,
                data: err,
                message: constants.FAIL_REGISTER_TOKEN,
              });
            });
        } else {
          return res.status(401).send({
            success: "true",
            statusCode: 401,
            data: data,
            message: constants.PASSWORD_NOT_MATCH,
          });
        }
      } else {
        return res.status(404).send({
          success: "true",
          statusCode: 404,
          data: null,
          message: constants.USER_NOT_FOUND,
        });
        // const salt = await bcrypt.genSalt(10);
        // const passHash = await bcrypt.hash(password, salt);
        // await User.create({ username: username, password: passHash, rol: 2 })
        //     .then(async data => {
        //         await Driver.create({ idNumber: '', phone: username, fullname: '', UserId: data.id })
        //             .then(profileData => {
        //                 const accessToken = jwt.sign({ id: data.id, username: username, rol: 2 }, accessTokenSecret);
        //                 Session.create({ sessionToken: accessToken, UserId: data.id })
        //                     .then(sessionData => {
        //                         return res.status(200).send({
        //                             success: 'true',
        //                             statusCode: 200,
        //                             data: {
        //                                 token: accessToken,
        //                                 userData: {
        //                                     id: data.id,
        //                                     username: data.username,
        //                                     token: data.notificationToken,
        //                                     role: data.rol,
        //                                     profile: profileData
        //                                 }
        //                             },
        //                             message: constants.SUCCESS_LOGIN
        //                         });
        //                     })
        //                     .catch(err => {
        //                         return res.status(500).send({
        //                             success: 'false',
        //                             statusCode: 500,
        //                             data: err,
        //                             message: constants.FAIL_REGISTER_TOKEN
        //                         });
        //                     });
        //             })
        //             .catch(err => {
        //                 return res.status(500).send({
        //                     success: 'false',
        //                     statusCode: 500,
        //                     data: err,
        //                     message: constants.FAIL_REGISTER
        //                 });
        //             });
        //     })
        //     .catch(err => {
        //         return res.status(500).send({
        //             success: 'false',
        //             statusCode: 500,
        //             data: err,
        //             message: constants.FAIL_REGISTER
        //         });
        //     });
      }
    })
    .catch((err) => {
      return res.status(404).send({
        success: "false",
        statusCode: 404,
        data: err,
        message: constants.USER_NOT_FOUND,
      });
    });
};

// LogOut Method
exports.SignOut = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    await Session.destroy({ where: { sessionToken: token } })
      .then(() => {
        res.status(200).send({
          success: "true",
          statusCode: 200,
          data: null,
          message: constants.SUCCESS_LOGOUT,
        });
      })
      .catch((err) => {
        res.status(500).send({
          success: "false",
          statusCode: 500,
          data: err,
          message: constants.FAIL_LOGOUT,
        });
      });
  } else {
    res.status(401).send({
      success: "true",
      statusCode: 401,
      data: data,
      message: constants.INVALID_TOKEN,
    });
  }
};

// SignUp Method
exports.SignUp = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirm = req.body.confirm;
  const fullname = req.body.fullname;
  const phone = req.body.phone;
  const type = parseInt(req.body.type);
  const picture = req.body.picture;

  if (!(username && password && confirm && fullname && type)) {
    return res.status(400).send({
      success: "false",
      statusCode: 400,
      data: null,
      message: constants.EMPTY_DATA,
    });
  }

  const result = await User.findOne({ where: { username: username } })
    .then((data) => {
      if (data === null) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      return false;
    });

  if (result === false) {
    return res.status(409).send({
      success: "true",
      statusCode: 409,
      data: null,
      message: constants.ALREADY_REGISTERED,
    });
  }

  if (password !== confirm) {
    return res.status(400).send({
      success: "false",
      statusCode: 400,
      data: null,
      message: constants.PASSWORDS_NOT_MATCH,
    });
  }

  const salt = await bcrypt.genSalt(10);
  const passHash = await bcrypt.hash(password, salt);

  await User.create({ username: username, password: passHash, rol: type })
    .then(async (data) => {
      if (type === 1) {
        if (picture === "") {
          await Root.create({ fullname: fullname, UserId: data.id })
            .then((profileData) => {
              return res.status(200).send({
                success: "true",
                statusCode: 200,
                data: profileData,
                message: constants.SUCCESS_REGISTER,
              });
            })
            .catch((err) => {
              return res.status(500).send({
                success: "false",
                statusCode: 500,
                data: err,
                message: constants.FAIL_REGISTER,
              });
            });
        } else {
          await Root.create({ fullname: fullname, UserId: data.id })
            .then(async (profileData) => {
              await Picture.create({
                path: picture,
                UserId: profileData.UserId,
              });
              return res.status(200).send({
                success: "true",
                statusCode: 200,
                data: profileData,
                message: constants.SUCCESS_REGISTER,
              });
            })
            .catch((err) => {
              return res.status(500).send({
                success: "false",
                statusCode: 500,
                data: err,
                message: constants.FAIL_REGISTER,
              });
            });
        }
      }

      if (type === 2) {
        const plates = req.body.plates;
        const transportLine = req.body.transportLine;
        if (picture === "") {
          await Driver.create({
            plates: plates,
            phone: phone,
            fullname: fullname,
            transportLine: transportLine,
            UserId: data.id,
          })
            .then((profileData) => {
              return res.status(200).send({
                success: "true",
                statusCode: 200,
                data: profileData,
                message: constants.SUCCESS_REGISTER,
              });
            })
            .catch((err) => {
              return res.status(500).send({
                success: "false",
                statusCode: 500,
                data: err,
                message: constants.FAIL_REGISTER,
              });
            });
        } else {
          await Driver.create({
            plates: plates,
            phone: phone,
            fullname: fullname,
            transportLine: transportLine,
            UserId: data.id,
          })
            .then(async (profileData) => {
              await Picture.create({
                path: picture,
                UserId: profileData.UserId,
              });
              return res.status(200).send({
                success: "true",
                statusCode: 200,
                data: profileData,
                message: constants.SUCCESS_REGISTER,
              });
            })
            .catch((err) => {
              return res.status(500).send({
                success: "false",
                statusCode: 500,
                data: err,
                message: constants.FAIL_REGISTER,
              });
            });
        }
      }
      if (type === 3) {
        const fullname = req.body.fullname;
        const companyNumber = req.body.companyNumber;
        const phone = req.body.phone;
        const contact = req.body.contact;
        const address = req.body.address;
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;
        if (picture === "") {
          await Admin.create({
            companyNumber: companyNumber, fullname: fullname, phone: phone, contact: contact, address: address,latitude:latitude,longitude:longitude,UserId: data.id,
          })
          .then(async (profileData) => {
            await Picture.create({
              path: picture,
              UserId: profileData.UserId,
            });
            return res.status(200).send({
              success: "true",
              statusCode: 200,
              data: profileData,
              message: constants.SUCCESS_REGISTER,
            });
          })
          
        } 
      }
      if (type === 4) {
        const plates = req.body.plates;
        const transportLine = req.body.transportLine;
        if (picture === "") {
          await Helper.create({
            plates: plates,
            phone: phone,
            fullname: fullname,
            transportLine: transportLine,
            UserId: data.id,
          })
            .then((profileData) => {
              return res.status(200).send({
                success: "true",
                statusCode: 200,
                data: profileData,
                message: constants.SUCCESS_REGISTER,
              });
            })
            .catch((err) => {
              return res.status(500).send({
                success: "false",
                statusCode: 500,
                data: err,
                message: constants.FAIL_REGISTER,
              });
            });
        } else {
          await Helper.create({
            plates: plates,
            phone: phone,
            fullname: fullname,
            transportLine: transportLine,
            UserId: data.id,
          })
            .then(async (profileData) => {
              await Picture.create({
                path: picture,
                UserId: profileData.UserId,
              });
              return res.status(200).send({
                success: "true",
                statusCode: 200,
                data: profileData,
                message: constants.SUCCESS_REGISTER,
              });
            })
            .catch((err) => {
              return res.status(500).send({
                success: "false",
                statusCode: 500,
                data: err,
                message: constants.FAIL_REGISTER,
              });
            });
        }
      }
    })
    .catch((err) => {
      return res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.FAIL_REGISTER,
      });
    });
};

// DataSul create Driver
exports.DriverRegister = async (req, res) => {
  let password = req.body.password;
  let fullname = req.body.fullname;
  let phone = req.body.phone;

  fullname = fullname.replace("%20", " ");
  fullname = fullname.replace("%D1", "Ñ");
  fullname = fullname.replace("%F1", "ñ");
  fullname = fullname.replace("%23", "#");
  fullname = fullname.replace("%E9", "é");

  if (!(phone && password && fullname)) {
    let obj = {
      '?xml version="1.0" encoding="iso-8859-1"?': null,
      result: {
        "@": {
          api: "Save Driver",
          method: "POST",
        },
        "#": {
          success: "true",
          statusCode: 400,
          message: constants.EMPTY_DATA,
        },
      },
    };
    let xml = o2x(obj);
    return res.status(400).send(xml);
  }

  const result = await User.findOne({ where: { username: phone } })
    .then((data) => {
      if (data === null) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      return false;
    });

  if (result === false) {
    let obj = {
      '?xml version="1.0" encoding="iso-8859-1"?': null,
      result: {
        "@": {
          api: "Save Driver",
          method: "POST",
        },
        "#": {
          success: "true",
          statusCode: 409,
          message: constants.ALREADY_REGISTERED,
        },
      },
    };
    let xml = o2x(obj);
    return res.status(409).send(xml);
  }

  const salt = await bcrypt.genSalt(10);
  const passHash = await bcrypt.hash(password, salt);

  await User.create({ username: phone, password: passHash, rol: 2 })
    .then(async (data) => {
      await Driver.create({ phone: phone, fullname: fullname, UserId: data.id })
        .then((profileData) => {
          let obj = {
            '?xml version="1.0" encoding="iso-8859-1"?': null,
            result: {
              "@": {
                api: "Save Driver",
                method: "POST",
              },
              "#": {
                success: "true",
                statusCode: 200,
                message: constants.SUCCESS_REGISTER,
              },
            },
          };
          let xml = o2x(obj);
          return res.status(200).send(xml);
        })
        .catch((err) => {
          let obj = {
            '?xml version="1.0" encoding="iso-8859-1"?': null,
            result: {
              "@": {
                api: "Save Driver",
                method: "POST",
              },
              "#": {
                success: "false",
                statusCode: 500,
                message: constants.FAIL_REGISTER,
              },
            },
          };
          let xml = o2x(obj);
          return res.status(500).send(xml);
        });
    })
    .catch((err) => {
      let obj = {
        '?xml version="1.0" encoding="iso-8859-1"?': null,
        result: {
          "@": {
            api: "Save Driver",
            method: "POST",
          },
          "#": {
            success: "false",
            statusCode: 500,
            message: constants.FAIL_REGISTER,
          },
        },
      };
      let xml = o2x(obj);
      return res.status(500).send(xml);
    });
};

// Update Notification Token
exports.UpdateToken = async (req, res) => {
  const id = req.params.id;
  const token = req.body.token;

  if (!(id && token)) {
    return res.status(400).send({
      success: "false",
      statusCode: 400,
      data: null,
      message: constants.EMPTY_DATA,
    });
  }

  await User.update({ notificationToken: token }, { where: { id: id } })
    .then(async (data) => {
      if (data !== null) {
        return res.status(200).send({
          success: "true",
          statusCode: 200,
          data: data,
          message: constants.SUCCESS_UPDATE_DRIVER,
        });
      } else {
        res.status(500).send({
          success: "false",
          statusCode: 500,
          data: err,
          message: constants.FAIL_UPDATE_DRIVER,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.FAIL_UPDATE_DRIVER,
      });
    });
};
