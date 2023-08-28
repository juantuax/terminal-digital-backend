const db = require("../models");
const constants = require("../resources/constants");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const Helper = db.helper;
const User = db.users;
const Picture = db.picture;
const Referral = db.referral;

// get all Helpers
exports.GetAllHelpers = async (req, res) => {
  await Helper.findAll({ include: ["User"] })
    .then((data) => {
      if (data === null) {
        res.status(404).send({
          success: "true",
          statusCode: 404,
          data: null,
          message: constants.HELPERS_NOT_FOUND,
        });
      } else {
        res.status(200).send({
          success: "true",
          statusCode: 200,
          data: data,
          message: constants.HELPERS_FOUND,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.HELPERS_NOT_FOUND,
      });
    });
};

exports.GetAllHelpersDatasul = async (req, res) => {
  await Helper.findAll({ include: ["User"] })
    .then((data) => {
      if (data === null) {
        let obj = {
          '?xml version="1.0" encoding="iso-8859-1"?': null,
          result: {
            "@": {
              api: "GET Helpers",
              method: "GET",
            },
            "#": {
              success: "true",
              statusCode: 404,
              message: constants.HELPERS_NOT_FOUND,
            },
          },
        };
        let xml = o2x(obj);
        return res.status(404).send(xml);
      } else {
        let helper = [];
        for (let index = 0; index <= data.length - 1; index++) {
          let tmpObj = {
            "#": {
              id: data[index].id,
              fullname: data[index].fullname,
              phone: data[index].phone,
              transportLine: data[index].transportLine,
              plates: data[index].plates,
              creado: data[index].createdAt,
            },
          };
          helper.push(tmpObj);
        }
        let obj = {
          '?xml version="1.0" encoding="iso-8859-1"?': null,
          helpers: {
            "@": {
              api: "GET Helpers",
              method: "GET",
            },
            helper,
          },
        };
        let xml = o2x(obj);
        return res.status(200).send(xml);
      }
    })
    .catch((err) => {
      let obj = {
        '?xml version="1.0" encoding="iso-8859-1"?': null,
        result: {
          "@": {
            api: "GET Helpers",
            method: "GET",
          },
          "#": {
            success: "false",
            statusCode: 500,
            message: constants.HELPERS_NOT_FOUND,
          },
        },
      };
      let xml = o2x(obj);
      return res.status(500).send(xml);
    });
};

// get one Helper
exports.GetOneHelper = async (req, res) => {
  const id = req.params.id;
  await Helper.findOne({ where: { id: id }, include: ["User"] })
    .then((data) => {
      if (data === null) {
        res.status(404).send({
          success: "true",
          statusCode: 404,
          data: null,
          message: constants.HELPER_NOT_FOUND,
        });
      } else {
        res.status(200).send({
          success: "true",
          statusCode: 200,
          data: data,
          message: constants.HELPER_FOUND,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.HELPER_NOT_FOUND,
      });
    });
};

// get one Helper
exports.GetOneHelperPhone = async (req, res) => {
  const id = req.params.id;
  await Helper.findOne({ where: { phone: id }, include: ["User"] })
    .then((data) => {
      if (data === null) {
        res.status(404).send({
          success: "true",
          statusCode: 404,
          data: null,
          message: constants.HELPER_NOT_FOUND,
        });
      } else {
        res.status(200).send({
          success: "true",
          statusCode: 200,
          data: data,
          message: constants.HELPER_FOUND,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.HELPER_NOT_FOUND,
      });
    });
};

// update Helper
exports.UpdateHelper = async (req, res) => {
  const id = req.params.id;
  const plates = req.body.plates;
  const phone = req.body.phone;
  const password = req.body.password;
  const fullname = req.body.fullname;
  const userId = req.body.userId;
  const username = req.body.username;
  const salt = await bcrypt.genSalt(10);
  const passHash = await bcrypt.hash(password, salt);
  const picture = req.body.picture;
  const transportLine = req.body.transportLine;

  const result = await User.findOne({
    where: {
      [Op.and]: [
        { username: { [Op.eq]: username } },
        { id: { [Op.ne]: userId } },
      ],
    },
  })
    .then((data) => {
      if (data !== null) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      return false;
    });

  if (result !== false) {
    return res.status(409).send({
      success: "true",
      statusCode: 409,
      data: null,
      message: constants.ALREADY_REGISTERED,
    });
  }
  if (picture !== "") {
    await Picture.findOne({ where: { UserId: userId } })
      .then(async (data) => {
        if (data !== null) {
          await Picture.update(
            { path: picture },
            { where: { UserId: userId } }
          );
        } else {
          await Picture.create({ path: picture, UserId: userId });
        }
      })
      .catch((err) => {
        res.status(500).send({
          success: "false",
          statusCode: 500,
          data: err,
          message: constants.FAIL_UPDATE_HELPER,
        });
      });
  }
  await Helper.update(
    {
      plates: plates,
      fullname: fullname,
      phone: phone,
      transportLine: transportLine,
    },
    { where: { id: id } }
  )
    .then(async (data) => {
      if (password != "") {
        await User.update(
          { username: username, password: passHash },
          { where: { id: userId } }
        )
          .then((data) => {
            res.status(200).send({
              success: "true",
              statusCode: 200,
              data: data,
              message: constants.SUCCESS_UPDATE_HELPER,
            });
          })
          .catch((err) => {
            res.status(500).send({
              success: "false",
              statusCode: 500,
              data: err,
              message: constants.FAIL_UPDATE_HELPER,
            });
          });
      } else {
        await User.update({ username: username }, { where: { id: userId } })
          .then((data) => {
            res.status(200).send({
              success: "true",
              statusCode: 200,
              data: data,
              message: constants.SUCCESS_UPDATE_HELPER,
            });
          })
          .catch((err) => {
            res.status(500).send({
              success: "false",
              statusCode: 501,
              data: err,
              message: constants.FAIL_UPDATE_HELPER,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.FAIL_UPDATE_HELPER,
      });
    });
};

exports.UpdateProfile = async (req, res) => {
  const id = req.params.id;
  const phone = req.body.phone;
  const fullname = req.body.fullname;

  await Helper.update(
    { fullname: fullname, phone: phone },
    { where: { id: id } }
  )
    .then(async (data) => {
      return res.status(200).send({
        success: "true",
        statusCode: 200,
        data: data,
        message: constants.SUCCESS_UPDATE_HELPER,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.FAIL_UPDATE_HELPER,
      });
    });
};

//delete Helper
exports.DeleteHelper = async (req, res) => {
  const id = req.params.id;

  await User.update({ active: 0 }, { where: { id: id } })
    .then(() => {
      res.status(200).send({
        success: "true",
        statusCode: 200,
        data: null,
        message: constants.SUCCESS_DELETE_HELPER,
      });
    })
    .catch((err) => {
      res.status(501).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.FAIL_DELETE_HELPER,
      });
    });
};

//Active Helper
exports.ActiveHelper = async (req, res) => {
  const id = req.params.id;
  await User.update({ active: 1 }, { where: { id: id } })
    .then(() => {
      res.status(200).send({
        success: "true",
        statusCode: 200,
        data: null,
        message: constants.SUCCESS_UPDATE_HELPER,
      });
    })
    .catch((err) => {
      res.status(501).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.FAIL_DELETE_HELPER,
      });
    });
};

// End Trial
exports.EndTrial = async (req, res) => {
  const id = req.params.id;
  await Helper.update({ trial: 1 }, { where: { id: id } })
    .then(() => {
      res.status(200).send({
        success: "true",
        statusCode: 200,
        data: null,
        message: constants.SUCCESS_UPDATE_HELPER,
      });
    })
    .catch((err) => {
      res.status(501).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.FAIL_DELETE_HELPER,
      });
    });
};
