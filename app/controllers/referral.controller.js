const db = require("../models");
const constants = require("../resources/constants");
const { Op } = require("sequelize");
var o2x = require("object-to-xml");
const path = require("path");
const moment = require("moment");
const paginate = require("jw-paginate");
const fetch = require("node-fetch");
const Referral = db.referral;
const Datasul = db.datasul;
const Delivery = db.delivery;
const Location = db.location;
const Document = db.document;
const Driver = db.driver;
const Client = db.client;
const Company = db.company;
const User = db.users;

const GeocoderDirections = async (latlong) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlong}&key=AIzaSyCqKecPidNbJpzL3fTjkiWEtabjBVXqzUU`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
    }
  )
    .then((result) => {
      return result.json();
    })
    .then((json) => {
      return json;
    })
    .catch((error) => {
      return null;
    });
  return response;
};

exports.GetAllReferralsDatasuls = async (req, res) => {
  await Referral.findAll({ include: ["Company", "Driver", "Client"] })
    .then((data) => {
      if (data === null) {
        return res.status(404).send({
          success: "true",
          statusCode: 404,
          data: null,
          message: constants.REFERRALS_NOT_FOUND,
        });
      } else {
        let referral = [];
        for (let index = 0; index <= data.length - 1; index++) {
          let tmpObj = {
            "#": {
              id: data[index].id,
              nroRemision: data[index].referralNumber,
              ejecutivo: data[index].executive,
              fechaRegistro: data[index].createdAt,
              fechaProgramada: data[index].dateIssue,
              latitud: data[index].latitude,
              longitud: data[index].longitude,
              estado: data[index].status === 0 ? "PENDIENTE" : "ENTREGADA",
              lineaTransporte: data[index].transportLine,
              rastreoAutomatico: data[index].flag === 0 ? "NO" : "SI",
              intervaloMinutos: data[index].requestTime,
              codigoCliente: data[index].Client.codeClient,
              nombreCliente: data[index].Client.fullname,
              codigoSucursal: data[index].Company.companyNumber,
              nombreSucursal: data[index].Company.fullname,
              nroConductor: data[index].Driver.phone,
              nombreConductor: data[index].Driver.fullname,
            },
          };
          referral.push(tmpObj);
        }
        let obj = {
          '?xml version="1.0" encoding="iso-8859-1"?': null,
          referrals: {
            "@": {
              api: "Get Referrals",
              method: "GET",
            },
            referral,
          },
        };
        let xml = o2x(obj);
        return res.status(200).send(xml);
      }
    })
    .catch((err) => {
      return res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.REFERRALS_NOT_FOUND,
      });
    });
};

exports.GetAllReferralsDataSul = async (req, res) => {
  await Datasul.findAll()
    .then(async (data) => {
      if (data === null) {
        return res.status(404).send({
          success: "true",
          statusCode: 404,
          data: null,
          message: constants.REFERRALS_NOT_FOUND,
        });
      } else {
        let referral = [];
        for (let index = 0; index <= data.length - 1; index++) {
          let tmpObj = {
            "#": {
              idInterno: data[index].id,
              nroRemision: data[index].referralNumber,
              entrega: data[index].dateDelivery,
              latitud: data[index].latitude,
              longitud: data[index].longitude,
            },
          };
          referral.push(tmpObj);
        }
        let obj = {
          '?xml version="1.0" encoding="iso-8859-1"?': null,
          referrals: {
            "@": {
              api: "Get Referrals",
              method: "GET",
            },
            referral,
          },
        };
        let xml = o2x(obj);
        return res.status(200).send(xml);
      }
    })
    .catch((err) => {
      return res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.REFERRALS_NOT_FOUND,
      });
    });
};

exports.GetEvidenceDatasul = async (req, res) => {
  const id = req.params.id;
  await Document.findAll({ where: { DatasulId: id } })
    .then((data) => {
      if (data === null) {
        let obj = {
          '?xml version="1.0" encoding="iso-8859-1"?': null,
          result: {
            "@": {
              api: "GET Evidence",
              method: "GET",
            },
            "#": {
              success: "true",
              statusCode: 404,
              message: constants.PICTURE_NOT_FOUND,
            },
          },
        };
        let xml = o2x(obj);
        return res.status(404).send(xml);
      } else {
        let image = [];
        for (let index = 0; index <= data.length - 1; index++) {
          let tmpPath = data[index].path ? data[index].path : "SN";
          let tmpObj = {
            "#": {
              ruta: `${tmpPath}`,
            },
          };
          image.push(tmpObj);
        }
        let obj = {
          '?xml version="1.0" encoding="iso-8859-1"?': null,
          images: {
            "@": {
              api: "GET Evidence",
              method: "GET",
            },
            image,
          },
        };
        let xml = o2x(obj);
        res.status(200).send(xml);
      }
    })
    .catch((err) => {
      let obj = {
        '?xml version="1.0" encoding="iso-8859-1"?': null,
        result: {
          "@": {
            api: "GET Evidence",
            method: "GET",
          },
          "#": {
            success: "false",
            statusCode: 500,
            message: constants.PICTURE_NOT_FOUND,
          },
        },
      };
      let xml = o2x(obj);
      return res.status(500).send(xml);
    });
};

exports.UpdateDeliveryDatasul = async (req, res) => {
  const id = req.params.id;
  await Datasul.destroy({ where: { id: id } })
    .then((data) => {
      let obj = {
        '?xml version="1.0" encoding="iso-8859-1"?': null,
        result: {
          "@": {
            api: "DELETE Datasul",
            method: "DELETE",
          },
          "#": {
            success: "true",
            statusCode: 200,
            message: constants.SUCCESS_UPDATE_DATASUL,
          },
        },
      };
      let xml = o2x(obj);
      return res.status(500).send(xml);
    })
    .catch((err) => {
      let obj = {
        '?xml version="1.0" encoding="iso-8859-1"?': null,
        result: {
          "@": {
            api: "DELETE Datasul",
            method: "DELETE",
          },
          "#": {
            success: "false",
            statusCode: 500,
            message: constants.FAIL_UPDATE_DATASUL,
          },
        },
      };
      let xml = o2x(obj);
      return res.status(500).send(xml);
    });
};

exports.CreateReferralDataSul = async (req, res) => {
  let referral = req.body.referral;
  let driver = req.body.driver;
  let client = req.body.client;
  let company = req.body.company;
  let line = req.body.line;
  let date = req.body.date;
  let executive = req.body.executive;
  let flag = req.body.flag;
  let requestTime = req.body.requestTime;
  let lat = req.body.lat;
  let long = req.body.long;
  let address = req.body.address;

  line = line.replace("%20", " ");
  line = line.replace("%D1", "Ñ");
  line = line.replace("%F1", "ñ");
  line = line.replace("%23", "#");
  line = line.replace("%E9", "é");
  address = address.replace("%20", " ");
  address = address.replace("%D1", "Ñ");
  address = address.replace("%F1", "ñ");
  address = address.replace("%23", "#");
  address = address.replace("%E9", "é");
  executive = executive.replace("%20", " ");
  executive = executive.replace("%D1", "Ñ");
  executive = executive.replace("%F1", "ñ");
  executive = executive.replace("%23", "#");
  executive = executive.replace("%E9", "é");

  if (
    !referral ||
    !driver ||
    !client ||
    !company ||
    !line ||
    !date ||
    !address
  ) {
    let obj = {
      '?xml version="1.0" encoding="iso-8859-1"?': null,
      result: {
        "@": {
          api: "Save Referral",
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

  const result = await Referral.findOne({ where: { referralNumber: referral } })
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
          api: "Save Referral",
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
  const idClient = await Client.findOne({ where: { codeClient: client } });
  if (idClient === null) {
    let obj = {
      '?xml version="1.0" encoding="iso-8859-1"?': null,
      result: {
        "@": {
          api: "Save Referral",
          method: "POST",
        },
        "#": {
          success: "true",
          statusCode: 405,
          message: constants.CLIENT_NOT_FOUND,
        },
      },
    };
    let xml = o2x(obj);
    return res.status(400).send(xml);
  }
  const idCompany = await Company.findOne({
    where: { companyNumber: company },
  });
  if (idCompany === null) {
    let obj = {
      '?xml version="1.0" encoding="iso-8859-1"?': null,
      result: {
        "@": {
          api: "Save Referral",
          method: "POST",
        },
        "#": {
          success: "true",
          statusCode: 406,
          message: constants.CLIENT_NOT_FOUND,
        },
      },
    };
    let xml = o2x(obj);
    return res.status(400).send(xml);
  }
  const idDriver = await Driver.findOne({ where: { phone: driver } });
  if (idDriver === null) {
    let obj = {
      '?xml version="1.0" encoding="iso-8859-1"?': null,
      result: {
        "@": {
          api: "Save Referral",
          method: "POST",
        },
        "#": {
          success: "true",
          statusCode: 407,
          message: constants.DRIVERS_NOT_FOUND,
        },
      },
    };
    let xml = o2x(obj);
    return res.status(400).send(xml);
  }

  await Referral.create({
    referralNumber: referral,
    DriverId: idDriver.UserId,
    CompanyId: idCompany.id,
    ClientId: idClient.id,
    transportLine: line,
    executive: executive,
    flag: flag,
    requestTime: requestTime,
    dateIssue: date,
    latitude: lat,
    longitude: long,
    address: address,
  })
    .then(async (data) => {
      let obj = {
        '?xml version="1.0" encoding="iso-8859-1"?': null,
        result: {
          "@": {
            api: "Save Referral",
            method: "POST",
          },
          "#": {
            success: "true",
            statusCode: 200,
            remision: data,
            message: constants.SUCCESS_CREATE_REFERRAL,
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
            api: "Save Referral",
            method: "POST",
          },
          "#": {
            success: "true",
            statusCode: 500,
            message: constants.FAIL_CREATE_REFERRAL,
          },
        },
      };
      let xml = o2x(obj);
      return res.status(500).send(xml);
    });
};

//// WEB ALL REFERRALS
exports.GetAllReferrals = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;

  await Referral.findAll({ include: ["Company", "Driver", "Client"] })
    .then((data) => {
      if (data === null) {
        return res.status(404).send({
          success: "true",
          statusCode: 404,
          data: null,
          message: constants.REFERRALS_NOT_FOUND,
        });
      } else {
        const pager = paginate(data.length, page, pageSize);
        const pageOfItems = data.slice(pager.startIndex, pager.endIndex + 1);
        const pagObj = {
          page: page,
          pageSize: pageSize,
          items: pageOfItems,
          pagerInfo: pager,
        };

        return res.status(200).send({
          success: "true",
          statusCode: 200,
          data: data,
          pagination: pagObj,
          message: constants.REFERRALS_FOUND,
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.REFERRALS_NOT_FOUND,
      });
    });
};

exports.GetAllReferralsFlag = async (req, res) => {
  await Referral.findAll({
    where: { flag: 1 },
    include: ["Company", "Driver", "Client"],
  })
    .then((data) => {
      if (data === null) {
        res.status(404).send({
          success: "true",
          statusCode: 404,
          data: null,
          message: constants.REFERRALS_NOT_FOUND,
        });
      } else {
        res.status(200).send({
          success: "true",
          statusCode: 200,
          data: data,
          message: constants.REFERRALS_FOUND,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.REFERRALS_NOT_FOUND,
      });
    });
};

//// WEB ALL REFERRALS ADMINS
exports.GetAllReferralsAdmins = async (req, res) => {
  const id = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;

  await Referral.findAll({
    where: { CompanyId: id },
    include: ["Company", "Driver", "Client"],
  })
    .then((data) => {
      if (data === null) {
        return res.status(404).send({
          success: "true",
          statusCode: 404,
          data: null,
          message: constants.REFERRALS_COMPANY_NOT_FOUND,
        });
      } else {
        const pager = paginate(data.length, page, pageSize);
        const pageOfItems = data.slice(pager.startIndex, pager.endIndex + 1);
        const pagObj = {
          page: page,
          pageSize: pageSize,
          items: pageOfItems,
          pagerInfo: pager,
        };

        return res.status(200).send({
          success: "true",
          statusCode: 200,
          data: data,
          pagination: pagObj,
          message: constants.REFERRALS_COMPANY_FOUND,
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.REFERRALS_COMPANY_NOT_FOUND,
      });
    });
};

exports.GetAllReferralsAdminsFlag = async (req, res) => {
  const id = req.params.id;
  await Referral.findAll({
    where: {
      [Op.and]: [{ flag: { [Op.eq]: 1 } }, { CompanyId: { [Op.eq]: id } }],
    },
    include: ["Company", "Driver", "Client"],
  })
    .then((data) => {
      if (data === null) {
        res.status(404).send({
          success: "true",
          statusCode: 404,
          data: null,
          message: constants.REFERRALS_COMPANY_NOT_FOUND,
        });
      } else {
        res.status(200).send({
          success: "true",
          statusCode: 200,
          data: data,
          message: constants.REFERRALS_COMPANY_FOUND,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.REFERRALS_COMPANY_NOT_FOUND,
      });
    });
};

exports.GetAllReferralsDrivers = async (req, res) => {
  const id = parseInt(req.params.id);
  await Referral.findAll({
    where: { DriverId: id },
    include: ["Company", "Driver", "Client"],
  })
    .then((data) => {
      if (data === null) {
        res.status(404).send({
          success: "true",
          statusCode: 404,
          data: null,
          message: constants.REFERRALS_DRIVER_NOT_FOUND,
        });
      } else {
        res.status(200).send({
          success: "true",
          statusCode: 200,
          data: data,
          message: constants.REFERRALS_DRIVER_FOUND,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.REFERRALS_DRIVER_NOT_FOUND,
      });
    });
};

exports.GetAllReferralsDriversPending = async (req, res) => {
  const id = parseInt(req.params.id);
  await Referral.findAll({
    where: { DriverId: id, status: 0 },
    include: ["Company", "Driver", "Client"],
  })
    .then((data) => {
      if (data === null) {
        res.status(404).send({
          success: "true",
          statusCode: 404,
          data: null,
          message: constants.REFERRALS_DRIVER_NOT_FOUND,
        });
      } else {
        res.status(200).send({
          success: "true",
          statusCode: 200,
          data: data,
          message: constants.REFERRALS_DRIVER_FOUND,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.REFERRALS_DRIVER_NOT_FOUND,
      });
    });
};

exports.GetOneReferral = async (req, res) => {
  const id = req.params.id;
  await Referral.findOne({
    where: { id: id },
    include: ["Company", "Driver", "Client"],
  })
    .then((data) => {
      if (data === null) {
        res.status(404).send({
          success: "true",
          statusCode: 404,
          data: null,
          message: constants.REFERRAL_NOT_FOUND,
        });
      } else {
        res.status(200).send({
          success: "true",
          statusCode: 200,
          data: data,
          message: constants.REFERRAL_FOUND,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.REFERRAL_NOT_FOUND,
      });
    });
};

exports.CreateReferral = async (req, res) => {
  const referral = req.body.referral;
  const driver = parseInt(req.body.driver);
  const client = parseInt(req.body.client);
  const company = parseInt(req.body.company);
  const line = req.body.line;
  const date = req.body.date;
  const executive = req.body.executive;
  const flag = req.body.flag;
  const requestTime = req.body.request;
  const lat = req.body.lat;
  const long = req.body.long;
  const address = req.body.address;

  if (
    !referral ||
    !driver ||
    !client ||
    !company ||
    !line ||
    !date ||
    !address
  ) {
    return res.status(400).send({
      success: "true",
      statusCode: 400,
      data: null,
      message: constants.EMPTY_DATA,
    });
  }

  const result = await Referral.findOne({ where: { referralNumber: referral } })
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

  await Referral.create({
    referralNumber: referral,
    DriverId: driver,
    CompanyId: company,
    ClientId: client,
    transportLine: line,
    executive: executive,
    flag: flag,
    requestTime: requestTime,
    dateIssue: date,
    latitude: lat,
    longitude: long,
    address: address,
  })
    .then(async (data) => {
      return res.status(200).send({
        success: "true",
        statusCode: 200,
        data: data,
        message: constants.SUCCESS_CREATE_REFERRAL,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.FAIL_CREATE_REFERRAL,
      });
    });
};

exports.CreateReferralTest = async (req, res) => {
  const referral = "001-TEST";
  const driver = req.body.id;
  const client = 1;
  const company = 1;
  const line = "Línea de prueba";
  const date = moment().format("DD/MM/YYYY");
  const executive = "Juan Tua";
  const flag = 0;
  const requestTime = 0;
  const lat = 0;
  const long = 0;
  const address = "Dirección de prueba";

  await Referral.create({
    referralNumber: referral,
    DriverId: driver,
    CompanyId: company,
    ClientId: client,
    transportLine: line,
    executive: executive,
    flag: flag,
    requestTime: requestTime,
    dateIssue: date,
    latitude: lat,
    longitude: long,
    address: address,
  })
    .then((data) => {
      return res.status(200).send({
        success: "true",
        statusCode: 200,
        data: data,
        message: constants.SUCCESS_CREATE_REFERRAL,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.FAIL_CREATE_REFERRAL,
      });
    });
};

exports.UpdateReferralFlag = async (req, res) => {
  const referral = req.body.id;
  const flag = req.body.flag;
  const request = req.body.request;
  await Referral.update(
    { flag: flag, requestTime: request },
    { where: { id: referral } }
  )
    .then(async (data) => {
      res.status(200).send({
        success: "true",
        statusCode: 200,
        data: data,
        message: constants.SUCCESS_UPDATE_REFERRAL,
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.FAIL_UPDATE_REFERRAL,
      });
    });
};

exports.UpdateReferralStatus = async (req, res) => {
  const referral = req.params.id;
  const driver = parseInt(req.body.driver);
  const signature = req.body.signature;
  const image = req.body.image;
  const date = req.body.date;

  if (!referral || !driver || !image) {
    return res.status(400).send({
      success: "true",
      statusCode: 400,
      data: null,
      message: constants.EMPTY_DATA,
    });
  }

  const referralData = await Referral.findOne({ where: { id: referral } });
  // const locations = await Location.find({ where: { UserId: driver } });
  const locations = await Location.findAll({
    where: {
      [Op.and]: [
        { UserId: { [Op.eq]: driver } },
        { ReferralId: { [Op.eq]: referral } },
      ],
    },
    order: [["id", "DESC"]],
  });

  if (locations !== null) {
    await Delivery.create({
      dateDelivery: date,
      latitude: locations[0].latitude,
      longitude: locations[0].longitude,
    })
      .then(async (created) => {
        await Referral.update(
          { status: 1, DeliveryId: created.id },
          { where: { id: referral } }
        )
          .then(async (data) => {
            await Datasul.create({
              referralNumber: referralData.referralNumber,
              dateDelivery: date,
              latitude: locations[0].latitude,
              longitude: locations[0].longitude,
            })
              .then(async (datasulResponse) => {
                await Document.create({
                  path: image,
                  DeliveryId: created.id,
                  DatasulId: datasulResponse.id,
                });
                if (signature !== "") {
                  await Document.create({
                    path: signature,
                    DeliveryId: created.id,
                    DatasulId: datasulResponse.id,
                  });
                }
                return res.status(200).send({
                  success: "true",
                  statusCode: 200,
                  data: data,
                  message: constants.SUCCESS_UPDATE_REFERRAL,
                });
              })
              .catch((err) => {
                return res.status(500).send({
                  success: "false",
                  statusCode: 500,
                  data: err,
                  message: constants.FAIL_UPDATE_REFERRAL,
                });
              });
          })
          .catch((err) => {
            return res.status(500).send({
              success: "false",
              statusCode: 500,
              data: err,
              message: constants.FAIL_UPDATE_REFERRAL,
            });
          });
      })
      .catch((err) => {
        return res.status(500).send({
          success: "false",
          statusCode: 500,
          data: err,
          message: constants.FAIL_UPDATE_REFERRAL,
        });
      });
  } else {
    await Delivery.create({ dateDelivery: date, latitude: 0, longitude: 0 })
      .then(async (created) => {
        await Referral.update(
          { status: 1, DeliveryId: created.id },
          { where: { id: referral } }
        )
          .then(async (data) => {
            await Datasul.create({
              referralNumber: referralData.referralNumber,
              dateDelivery: date,
              latitude: 0,
              longitude: 0,
            })
              .then(async (datasulResponse) => {
                await Document.create({
                  path: image,
                  DeliveryId: created.id,
                  DatasulId: datasulResponse.id,
                });
                if (signature !== "") {
                  await Document.create({
                    path: signature,
                    DeliveryId: created.id,
                    DatasulId: datasulResponse.id,
                  });
                }
                return res.status(200).send({
                  success: "true",
                  statusCode: 200,
                  data: data,
                  message: constants.SUCCESS_UPDATE_REFERRAL,
                });
              })
              .catch((err) => {
                return res.status(500).send({
                  success: "false",
                  statusCode: 500,
                  data: err,
                  message: constants.FAIL_UPDATE_REFERRAL,
                });
              });
          })
          .catch((err) => {
            return res.status(500).send({
              success: "false",
              statusCode: 500,
              data: err,
              message: constants.FAIL_UPDATE_REFERRAL,
            });
          });
      })
      .catch((err) => {
        return res.status(500).send({
          success: "false",
          statusCode: 500,
          data: err,
          message: constants.FAIL_UPDATE_REFERRAL,
        });
      });
  }
};

exports.CloseReferral = async (req, res) => {
  const referral = req.params.id;
  const obs = req.body.observation;
  const date = Date.now();

  if (!referral || !obs) {
    return res.status(400).send({
      success: "true",
      statusCode: 400,
      data: null,
      message: constants.EMPTY_DATA,
    });
  }

  await Delivery.create({
    dateDelivery: date,
    latitude: 0,
    longitude: 0,
  })
    .then(async (created) => {
      await Referral.update(
        { status: 1, DeliveryId: created.id, observation: obs },
        { where: { referralNumber: referral } }
      )
        .then(async (data) => {
          await Datasul.create({
            referralNumber: referral,
            dateDelivery: date,
            latitude: 0,
            longitude: 0,
            observation: obs,
          })
            .then(async (datasulResponse) => {
              return res.status(200).send({
                success: "true",
                statusCode: 200,
                data: data,
                message: constants.SUCCESS_UPDATE_REFERRAL,
              });
            })
            .catch((err) => {
              return res.status(500).send({
                success: "false",
                statusCode: 500,
                data: err,
                message: constants.FAIL_UPDATE_REFERRAL,
              });
            });
        })
        .catch((err) => {
          return res.status(500).send({
            success: "false",
            statusCode: 500,
            data: err,
            message: constants.FAIL_UPDATE_REFERRAL,
          });
        });
    })
    .catch((err) => {
      return res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.FAIL_UPDATE_REFERRAL,
      });
    });
};

exports.DeleteReferral = async (req, res) => {
  const id = req.params.id;
  const idParsed = parseInt(id);
  if (!Number.isNaN(idParsed)) {
    console.log("HERE INT");
    await Referral.destroy({
      where: {
        id: id,
        status: 0,
      },
    })
      .then(() => {
        res.status(200).send({
          success: "true",
          statusCode: 200,
          data: null,
          message: constants.SUCCESS_DELETE_REFERRAL,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          success: "false",
          statusCode: 500,
          data: err,
          message: constants.FAIL_DELETE_REFERRAL,
        });
      });
  } else {
    await Referral.destroy({
      where: {
        referralNumber: id,
        status: 0,
      },
    })
      .then(() => {
        res.status(200).send({
          success: "true",
          statusCode: 200,
          data: null,
          message: constants.SUCCESS_DELETE_REFERRAL,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          success: "false",
          statusCode: 500,
          data: err,
          message: constants.FAIL_DELETE_REFERRAL,
        });
      });
  }
};

exports.ClearTestReferral = async (req, res) => {
  const id = req.params.id;
  await Referral.destroy({
    where: {
      [Op.and]: [
        { DriverId: { [Op.eq]: id } },
        { referralNumber: { [Op.eq]: "001-TEST" } },
      ],
    },
  })
    .then(async () => {
      await Driver.update({ trial: 1 }, { where: { id: id } });
      res.status(200).send({
        success: "true",
        statusCode: 200,
        data: null,
        message: constants.SUCCESS_DELETE_REFERRAL,
      });
    })
    .catch((err) => {
      res.status(500).send({
        success: "false",
        statusCode: 500,
        data: err,
        message: constants.FAIL_DELETE_REFERRAL,
      });
    });
};

//// New methods

exports.GetAllDatasulPendingReferral = async (req, res) => {
  await Referral.findAll({
    where: { status: 0 },
    include: ["Company", "Driver", "Client"],
  })
    .then(async (data) => {
      if (data === null) {
        let obj = {
          '?xml version="1.0" encoding="iso-8859-1"?': null,
          result: {
            "@": {
              api: "Get Referrals",
              method: "GET",
            },
            "#": {
              success: "true",
              statusCode: 404,
              message: constants.REFERRALS_NOT_FOUND,
            },
          },
        };
        let xml = o2x(obj);
        return res.status(404).send(xml);
      } else {
        let referral = [];
        for (let index = 0; index <= data.length - 1; index++) {
          let locations = await Location.findAll({
            limit: 1,
            where: { UserId: data[index].DriverId, ReferralId: data[index].id },
            order: [["createdAt", "DESC"]],
          });
          let directions;
          if (locations !== null) {
            if (locations.length > 0) {
              directions = await GeocoderDirections(
                `${locations[0].latitude},${locations[0].longitude}`
              );
            } else {
              directions = null;
            }
          } else {
            directions = null;
          }
          let routes = await Location.findAll({
            where: { ReferralId: data[index].id },
          });
          let showRoutes = [];
          // if (routes.length > 0) {
          //     for (let r = 0; r <= routes.length - 1; r++) {
          //         const element = routes[r];
          //         const obj = {
          //             latitude: element.latitude,
          //             longitude: element.longitude,
          //             dateTime: moment(element.createdAt).format("YYYY-MM-DD HH:mm:ss").toString()
          //         }
          //         showRoutes.push(obj);
          //     }
          // };
          if (routes.length > 0) {
            const lastIndex = routes.length - 1;
            const element = routes[lastIndex];
            const obj = {
              latitude: element.latitude,
              longitude: element.longitude,
              dateTime: moment(element.createdAt)
                .format("YYYY-MM-DD HH:mm:ss")
                .toString(),
            };
            showRoutes.push(obj);
          }
          let showObjRoute = {
            coordenadas: showRoutes,
          };
          if (directions !== null) {
            const country = directions.results[0].address_components.find(
              (x) => x.types[0] === "country"
            );
            const state = directions.results[0].address_components.find(
              (x) => x.types[0] === "administrative_area_level_1"
            );
            const city = directions.results[0].address_components.find(
              (x) => x.types[0] === "locality"
            );

            let tmpObj = {
              "#": {
                idInterno: data[index].id,
                codigoSucursal: data[index].Company.companyNumber,
                nroRemision: data[index].referralNumber,
                fechaUltimoRastreo:
                  directions === null
                    ? "SN"
                    : moment(locations[0].createdAt)
                        .format("YYYY-MM-DD HH:mm:ss")
                        .toString(),
                latitud: directions === null ? "SN" : locations[0].latitude,
                longitud: directions === null ? "SN" : locations[0].longitude,
                ciudad: city.long_name,
                entidad: state.long_name,
                pais: country.long_name,
                estado: "PENDIENTE",
                rastreoAutomatico: data[index].flag === 0 ? "NO" : "SI",
                intervaloMinutos: data[index].requestTime,
                ruta: routes.length > 0 ? showObjRoute : "",
              },
            };
            referral.push(tmpObj);
          } else {
            let tmpObj = {
              "#": {
                idInterno: data[index].id,
                codigoSucursal: data[index].Company.companyNumber,
                nroRemision: data[index].referralNumber,
                fechaUltimoRastreo:
                  directions === null
                    ? "SN"
                    : moment(locations[0].createdAt)
                        .format("YYYY-MM-DD HH:mm:ss")
                        .toString(),
                latitud: null,
                longitud: null,
                ciudad: null,
                entidad: null,
                pais: null,
                estado: "PENDIENTE",
                rastreoAutomatico: data[index].flag === 0 ? "NO" : "SI",
                intervaloMinutos: data[index].requestTime,
                ruta: routes.length > 0 ? showObjRoute : "",
              },
            };
            referral.push(tmpObj);
          }
        }
        let obj = {
          '?xml version="1.0" encoding="iso-8859-1"?': null,
          referrals: {
            "@": {
              api: "Get Referrals",
              method: "GET",
            },
            referral,
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
            api: "Get Referrals",
            method: "GET",
          },
          "#": {
            success: "false",
            statusCode: 500,
            message: constants.REFERRALS_NOT_FOUND,
          },
        },
      };
      let xml = o2x(obj);
      return res.status(500).send(xml);
    });
};

exports.GetAllDatasulDeliveredReferral = async (req, res) => {
  await Referral.findAll({
    where: { status: 1 },
    include: ["Company", "Driver", "Client", "Delivery"],
  })
    .then(async (data) => {
      if (data === null) {
        let obj = {
          '?xml version="1.0" encoding="iso-8859-1"?': null,
          result: {
            "@": {
              api: "Get Referrals",
              method: "GET",
            },
            "#": {
              success: "true",
              statusCode: 404,
              message: constants.REFERRALS_NOT_FOUND,
            },
          },
        };
        let xml = o2x(obj);
        return res.status(404).send(xml);
      } else {
        let referral = [];
        for (let index = 0; index <= data.length - 1; index++) {
          let directions = await GeocoderDirections(
            `${data[index].Delivery.latitude},${data[index].Delivery.longitude}`
          );
          let evidence = await Document.findAll({
            where: { DeliveryId: data[index].DeliveryId },
          });
          let routes = await Location.findAll({
            where: { ReferralId: data[index].id },
          });
          let showRoutes = [];
          // if (routes.length > 0) {
          //     for (let r = 0; r <= routes.length - 1; r++) {
          //         const element = routes[r];
          //         const obj = {
          //             latitude: element.latitude,
          //             longitude: element.longitude,
          //             dateTime: moment(element.createdAt).format("YYYY-MM-DD HH:mm:ss").toString()
          //         }
          //         showRoutes.push(obj);
          //     }
          // };
          if (routes.length > 0) {
            const lastIndex = routes.length - 1;
            const element = routes[lastIndex];
            const obj = {
              latitude: element.latitude,
              longitude: element.longitude,
              dateTime: moment(element.createdAt)
                .format("YYYY-MM-DD HH:mm:ss")
                .toString(),
            };
            showRoutes.push(obj);
          }
          let showObjRoute = {
            coordenadas: showRoutes,
          };
          let photo = "SN";
          let signature = "SN";
          if (evidence && evidence.length > 0) {
            if (evidence.length > 1) {
              photo = evidence[0].path ? evidence[0].path : "SN";
              signature = evidence[1].path ? evidence[1].path : "SN";
            } else {
              photo = evidence[0].path ? evidence[0].path : "SN";
              signature = "SN";
            }
          }
          const country = directions.results[0].address_components.find(
            (x) => x.types[0] === "country"
          );
          const state = directions.results[0].address_components.find(
            (x) => x.types[0] === "administrative_area_level_1"
          );
          const city = directions.results[0].address_components.find(
            (x) => x.types[0] === "locality"
          );
          let tmpObj = {
            "#": {
              idInterno: data[index].id,
              codigoSucursal: data[index].Company.companyNumber,
              nroRemision: data[index].referralNumber,
              fechaEntrega: moment(data[index].Delivery.dateDelivery)
                .format("YYYY-MM-DD HH:mm:ss")
                .toString(),
              latitud: data[index].Delivery.latitude,
              longitud: data[index].Delivery.longitude,
              ciudad: city.long_name,
              entidad: state.long_name,
              pais: country.long_name,
              estado: "ENTREGADO",
              urlImage: photo,
              urlFirma: signature,
              ruta: routes.length > 0 ? showObjRoute : "",
            },
          };
          referral.push(tmpObj);
        }
        let obj = {
          '?xml version="1.0" encoding="iso-8859-1"?': null,
          referrals: {
            "@": {
              api: "Get Referrals",
              method: "GET",
            },
            referral,
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
            api: "Get Referrals",
            method: "GET",
          },
          "#": {
            success: "false",
            statusCode: 500,
            message: constants.REFERRALS_NOT_FOUND,
          },
        },
      };
      let xml = o2x(obj);
      return res.status(500).send(xml);
    });
};

exports.DeleteReferralDatasul = async (req, res) => {
  const id = req.params.id;
  const idParsed = parseInt(id);
  if (!Number.isNaN(idParsed)) {
    await Referral.destroy({
      where: {
        id: id,
        status: 0,
      },
    })
      .then(() => {
        let obj = {
          '?xml version="1.0" encoding="iso-8859-1"?': null,
          result: {
            "@": {
              api: "Cancel Referral",
              method: "DELETE",
            },
            "#": {
              success: "true",
              statusCode: 200,
              message: constants.SUCCESS_DELETE_REFERRAL,
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
              api: "Cancel Referral",
              method: "DELETE",
            },
            "#": {
              success: "false",
              statusCode: 500,
              message: constants.FAIL_DELETE_REFERRAL,
            },
          },
        };
        let xml = o2x(obj);
        return res.status(500).send(xml);
      });
  } else {
    await Referral.destroy({
      where: {
        where: {
          referralNumber: id,
          status: 0,
        },
      },
    })
      .then(() => {
        let obj = {
          '?xml version="1.0" encoding="iso-8859-1"?': null,
          result: {
            "@": {
              api: "Cancel Referral",
              method: "DELETE",
            },
            "#": {
              success: "true",
              statusCode: 200,
              message: constants.SUCCESS_DELETE_REFERRAL,
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
              api: "Cancel Referral",
              method: "DELETE",
            },
            "#": {
              success: "false",
              statusCode: 500,
              message: constants.FAIL_DELETE_REFERRAL,
            },
          },
        };
        let xml = o2x(obj);
        return res.status(500).send(xml);
      });
  }
};

exports.UpdateReferralDatasul = async (req, res) => {
  const id = req.params.id;
  const referral = req.body.referral;
  const line = req.body.line;
  const date = req.body.date;
  const executive = req.body.executive;
  const flag = req.body.flag;
  const requestTime = req.body.request;
  const lat = req.body.lat;
  const long = req.body.long;
  const address = req.body.address;
  const status = req.body.status;

  if (!referral || !line || !date || !address) {
    let obj = {
      '?xml version="1.0" encoding="iso-8859-1"?': null,
      result: {
        "@": {
          api: "Update Referral",
          method: "PUT",
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

  await Referral.update(
    {
      referralNumber: referral,
      transportLine: line,
      executive: executive,
      flag: flag,
      requestTime: requestTime,
      dateIssue: date,
      latitude: lat,
      longitude: long,
      address: address,
      status: status,
    },
    { where: { id: id } }
  )
    .then(async (data) => {
      let obj = {
        '?xml version="1.0" encoding="iso-8859-1"?': null,
        result: {
          "@": {
            api: "Update Referral",
            method: "PUT",
          },
          "#": {
            success: "true",
            statusCode: 200,
            message: constants.SUCCESS_UPDATE_DATASUL,
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
            api: "Update Referral",
            method: "PUT",
          },
          "#": {
            success: "false",
            statusCode: 500,
            message: constants.FAIL_UPDATE_REFERRAL,
          },
        },
      };
      let xml = o2x(obj);
      return res.status(500).send(xml);
    });
};

exports.UpdateDriverReferralDatasul = async (req, res) => {
  const id = req.params.id;
  const phone = req.body.phone;

  if (!phone || !id) {
    let obj = {
      '?xml version="1.0" encoding="iso-8859-1"?': null,
      result: {
        "@": {
          api: "Update Driver",
          method: "PUT",
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

  await User.findOne({ where: { username: phone } })
    .then(async (data) => {
      if (data === null) {
        let obj = {
          '?xml version="1.0" encoding="iso-8859-1"?': null,
          result: {
            "@": {
              api: "Update Referral",
              method: "PUT",
            },
            "#": {
              success: "true",
              statusCode: 404,
              message: constants.REFERRALS_NOT_FOUND,
            },
          },
        };
        let xml = o2x(obj);
        return res.status(404).send(xml);
      } else {
        await Referral.update(
          { DriverId: data.id },
          { where: { id: id, status: 0 } }
        )
          .then(async (datas) => {
            let obj = {
              '?xml version="1.0" encoding="iso-8859-1"?': null,
              result: {
                "@": {
                  api: "Update Driver",
                  method: "PUT",
                },
                "#": {
                  success: "true",
                  statusCode: 200,
                  message: constants.SUCCESS_UPDATE_DATASUL,
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
                  api: "Update Driver",
                  method: "PUT",
                },
                "#": {
                  success: "false",
                  statusCode: 500,
                  message: constants.FAIL_UPDATE_REFERRAL,
                },
              },
            };
            let xml = o2x(obj);
            return res.status(500).send(xml);
          });
      }
    })
    .catch((err) => {
      let obj = {
        '?xml version="1.0" encoding="iso-8859-1"?': null,
        result: {
          "@": {
            api: "Update Driver",
            method: "PUT",
          },
          "#": {
            success: "false",
            statusCode: 500,
            message: constants.FAIL_UPDATE_REFERRAL,
          },
        },
      };
      let xml = o2x(obj);
      return res.status(500).send(xml);
    });
};

exports.CloseReferralDatasul = async (req, res) => {
  const referral = req.params.id;
  const obs = req.body.observation;
  const date = Date.now();

  if (!referral || !obs) {
    let obj = {
      '?xml version="1.0" encoding="iso-8859-1"?': null,
      result: {
        "@": {
          api: "Close Referral",
          method: "PUT",
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

  await Delivery.create({
    dateDelivery: date,
    latitude: 0,
    longitude: 0,
  })
    .then(async (created) => {
      await Referral.update(
        { status: 1, DeliveryId: created.id, observation: obs },
        { where: { referralNumber: referral } }
      )
        .then(async (data) => {
          await Datasul.create({
            referralNumber: referral,
            dateDelivery: date,
            latitude: 0,
            longitude: 0,
            observation: obs,
          })
            .then(async (datasulResponse) => {
              let obj = {
                '?xml version="1.0" encoding="iso-8859-1"?': null,
                result: {
                  "@": {
                    api: "Update Referral",
                    method: "PUT",
                  },
                  "#": {
                    success: "true",
                    statusCode: 200,
                    message: constants.SUCCESS_UPDATE_DATASUL,
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
                    api: "Update Referral",
                    method: "PUT",
                  },
                  "#": {
                    success: "false",
                    statusCode: 500,
                    message: constants.FAIL_UPDATE_REFERRAL,
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
                api: "Update Referral",
                method: "PUT",
              },
              "#": {
                success: "false",
                statusCode: 500,
                message: constants.FAIL_UPDATE_REFERRAL,
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
            api: "Update Referral",
            method: "PUT",
          },
          "#": {
            success: "false",
            statusCode: 500,
            message: constants.FAIL_UPDATE_REFERRAL,
          },
        },
      };
      let xml = o2x(obj);
      return res.status(500).send(xml);
    });
};

exports.GetAvisosDatasul = async (req, res) => {
  let where;
  if (req.query.referralNumber) {
    where = {
      referralNumber: req.query.referralNumber,
    };
  }
  if (req.query.status) {
    where = {
      ...where,
      status: req.query.status,
    };
  }
  if (req.query.company) {
    const companyResponse = await Company.findOne({
      where: { companyNumber: req.query.company },
    });
    if (companyResponse !== null) {
      where = {
        ...where,
        CompanyId: companyResponse.id,
      };
    } else {
      where = {
        ...where,
        CompanyId: req.query.company,
      };
    }
  }
  where = {
    ...where,
    [Op.or]: [{ pendingDatasul: 0 }, { pendingDatasul: 1 }],
  };
  await Referral.findAll({
    where: where,
    include: ["Company", "Driver", "Client", "Delivery"],
  })
    .then(async (data) => {
      if (data === null) {
        let obj = {
          '?xml version="1.0" encoding="iso-8859-1"?': null,
          result: {
            "@": {
              api: "Avisos Datasul",
              method: "GET",
            },
            "#": {
              success: "true",
              statusCode: 404,
              message: constants.REFERRALS_NOT_FOUND,
            },
          },
        };
        let xml = o2x(obj);
        return res.status(404).send(xml);
      } else {
        let referral = [];
        for (let index = 0; index <= data.length - 1; index++) {
          if (data[index].DeliveryId === null) {
            let locations = await Location.findAll({
              limit: 1,
              where: {
                UserId: data[index].DriverId,
                ReferralId: data[index].id,
              },
              order: [["createdAt", "DESC"]],
            });
            let directions;
            if (locations !== null) {
              if (locations.length > 0) {
                directions = await GeocoderDirections(
                  `${locations[0].latitude},${locations[0].longitude}`
                );
              } else {
                directions = null;
              }
            } else {
              directions = null;
            }
            let routes = await Location.findAll({
              where: { ReferralId: data[index].id },
            });
            let showRoutes = [];
            if (routes.length > 0) {
              const lastIndex = routes.length - 1;
              const element = routes[lastIndex];
              const obj = {
                latitude: element.latitude,
                longitude: element.longitude,
                dateTime: moment(element.createdAt)
                  .format("YYYY-MM-DD HH:mm:ss")
                  .toString(),
              };
              showRoutes.push(obj);
            }
            let showObjRoute = {
              coordenadas: showRoutes,
            };
            if (directions !== null) {
              const country = directions.results[0]?.address_components.find(
                (x) => x.types[0] === "country"
              );
              const state = directions.results[0]?.address_components.find(
                (x) => x.types[0] === "administrative_area_level_1"
              );
              const city = directions.results[0]?.address_components.find(
                (x) => x.types[0] === "locality"
              );

              let tmpObj = {
                "#": {
                  idInterno: data[index].id,
                  codigoSucursal: data[index].Company.companyNumber,
                  nroRemision: data[index].referralNumber,
                  fechaUltimoRastreo:
                    directions === null
                      ? "SN"
                      : moment(locations[0].createdAt)
                          .format("YYYY-MM-DD HH:mm:ss")
                          .toString(),
                  latitud: directions === null ? "SN" : locations[0].latitude,
                  longitud: directions === null ? "SN" : locations[0].longitude,
                  ciudad: city
                    ? city.long_name
                      ? city.long_name
                      : null
                    : null,
                  entidad: state
                    ? state.long_name
                      ? state.long_name
                      : null
                    : null,
                  pais: country
                    ? country.long_name
                      ? country.long_name
                      : null
                    : null,
                  estado: "PENDIENTE",
                  rastreoAutomatico: data[index].flag === 0 ? "NO" : "SI",
                  intervaloMinutos: data[index].requestTime,
                  ruta: routes.length > 0 ? showObjRoute : "",
                },
              };
              referral.push(tmpObj);
            } else {
              let tmpObj = {
                "#": {
                  idInterno: data[index].id,
                  codigoSucursal: data[index].Company.companyNumber,
                  nroRemision: data[index].referralNumber,
                  fechaUltimoRastreo:
                    directions === null
                      ? "SN"
                      : moment(locations[0].createdAt)
                          .format("YYYY-MM-DD HH:mm:ss")
                          .toString(),
                  latitud: null,
                  longitud: null,
                  ciudad: null,
                  entidad: null,
                  pais: null,
                  estado: "PENDIENTE",
                  rastreoAutomatico: data[index].flag === 0 ? "NO" : "SI",
                  intervaloMinutos: data[index].requestTime,
                  ruta: routes.length > 0 ? showObjRoute : "",
                },
              };
              referral.push(tmpObj);
            }
          } else {
            let directions = await GeocoderDirections(
              `${data[index].Delivery.latitude},${data[index].Delivery.longitude}`
            );
            let evidence = await Document.findAll({
              where: { DeliveryId: data[index].DeliveryId },
            });
            let routes = await Location.findAll({
              where: { ReferralId: data[index].id },
            });
            let showRoutes = [];
            if (routes.length > 0) {
              const lastIndex = routes.length - 1;
              const element = routes[lastIndex];
              const obj = {
                latitude: element.latitude,
                longitude: element.longitude,
                dateTime: moment(element.createdAt)
                  .format("YYYY-MM-DD HH:mm:ss")
                  .toString(),
              };
              showRoutes.push(obj);
            }
            let showObjRoute = {
              coordenadas: showRoutes,
            };
            let photo = "SN";
            let signature = "SN";
            if (evidence && evidence.length > 0) {
              if (evidence.length > 1) {
                photo = evidence[0].path ? evidence[0].path : "SN";
                signature = evidence[1].path ? evidence[1].path : "SN";
              } else {
                photo = evidence[0].path ? evidence[0].path : "SN";
                signature = "SN";
              }
            }
            const country = directions.results[0]?.address_components.find(
              (x) => x.types[0] === "country"
            );
            const state = directions.results[0]?.address_components.find(
              (x) => x.types[0] === "administrative_area_level_1"
            );
            const city = directions.results[0]?.address_components.find(
              (x) => x.types[0] === "locality"
            );
            let tmpObj = {
              "#": {
                idInterno: data[index].id,
                codigoSucursal: data[index].Company.companyNumber,
                nroRemision: data[index].referralNumber,
                fechaEntrega: moment(data[index].Delivery.dateDelivery)
                  .format("YYYY-MM-DD HH:mm:ss")
                  .toString(),
                latitud: data[index].Delivery.latitude,
                longitud: data[index].Delivery.longitude,
                ciudad: city ? (city.long_name ? city.long_name : null) : null,
                entidad: state
                  ? state.long_name
                    ? state.long_name
                    : null
                  : null,
                pais: country
                  ? country.long_name
                    ? country.long_name
                    : null
                  : null,
                estado: "ENTREGADO",
                urlImage: photo,
                urlFirma: signature,
                ruta: routes.length > 0 ? showObjRoute : "",
              },
            };
            referral.push(tmpObj);
          }
        }

        /////// Update Status
        await Referral.update(
          { pendingDatasul: 1 },
          { where: { status: 1, pendingDatasul: 0 } }
        );
        let obj = {
          '?xml version="1.0" encoding="iso-8859-1"?': null,
          referrals: {
            "@": {
              api: "Avisos Datasul",
              method: "GET",
            },
            referral,
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
            api: "Avisos Datasul",
            method: "GET",
          },
          "#": {
            success: "false",
            statusCode: 500,
            message: `${constants.REFERRALS_NOT_FOUND}: ${err}`,
          },
        },
      };
      let xml = o2x(obj);
      return res.status(500).send(xml);
    });
};

exports.CleanDatasul = async (req, res) => {
  await Referral.update({ pendingDatasul: 2 }, { where: { pendingDatasul: 1 } })
    .then((data) => {
      let obj = {
        '?xml version="1.0" encoding="iso-8859-1"?': null,
        referrals: {
          "@": {
            api: "Avisos Datasul Limpieza",
            method: "PUT",
          },
          "#": {
            success: "true",
            statusCode: 200,
            message: constants.REFERRALS_FOUND,
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
            api: "Avisos Datasul Limpieza",
            method: "PUT",
          },
          "#": {
            success: "false",
            statusCode: 500,
            message: constants.REFERRALS_NOT_FOUND,
          },
        },
      };
      let xml = o2x(obj);
      return res.status(500).send(xml);
    });
};
