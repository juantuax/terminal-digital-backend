/// Dependecys imports
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("./user.model.js")(sequelize, Sequelize);
db.admin = require("./admin.model.js")(sequelize, Sequelize);
db.adminDriver = require("./adminDriver.model.js")(sequelize, Sequelize);
db.adminUnity = require("./adminUnity.model.js")(sequelize, Sequelize);
db.bankAccounts = require("./bankAccount.model.js")(sequelize, Sequelize);
db.payments = require("./payment.model.js")(sequelize, Sequelize);
db.driver = require("./driver.model.js")(sequelize, Sequelize);
db.helper = require("./helper.model.js")(sequelize, Sequelize);
db.root = require("./root.model.js")(sequelize, Sequelize);
db.unity = require("./unity.model.js")(sequelize, Sequelize);
db.location = require("./location.model.js")(sequelize, Sequelize);
db.picture = require("./picture.model.js")(sequelize, Sequelize);
db.document = require("./document.model.js")(sequelize, Sequelize);
db.notification = require("./notification.model.js")(sequelize, Sequelize);
db.session = require("./session.model.js")(sequelize, Sequelize);
db.datasul = require("./datasul.model.js")(sequelize, Sequelize);
db.client = require("./client.model.js")(sequelize, Sequelize);
db.delivery = require("./delivery.model.js")(sequelize, Sequelize);
db.referral = require("./referral.model.js")(sequelize, Sequelize);
db.term = require("./terms.model.js")(sequelize, Sequelize);
db.version = require("./version.model.js")(sequelize, Sequelize);
db.switch = require("./switch.model.js")(sequelize, Sequelize);

/// Relationships
db.admin.belongsTo(db.users, { as: "User" });
db.driver.belongsTo(db.users, { as: "User" });
db.helper.belongsTo(db.users, { as: "User" });
db.root.belongsTo(db.users, { as: "User" });
db.adminDriver.belongsTo(db.users, { as: "Admin" });
db.adminDriver.belongsTo(db.users, { as: "Driver" });
db.adminUnity.belongsTo(db.users, { as: "Admin" });
db.adminUnity.belongsTo(db.unity, { as: "Unity" });
db.location.belongsTo(db.users, { as: "User" });
db.location.belongsTo(db.referral, { as: "Referral" });
db.payments.belongsTo(db.users, { as: "Terminal" });
db.payments.belongsTo(db.bankAccounts, { as: "BankAccount" });
db.session.belongsTo(db.users, { as: "User" });
db.picture.belongsTo(db.users, { as: "User" });
db.term.belongsTo(db.driver, { as: "Driver" });
db.delivery.hasMany(db.picture, { as: "Picture" });
db.delivery.hasMany(db.picture, { as: "Signature" });
db.delivery.hasMany(db.document, { as: "Document" });
db.datasul.hasMany(db.document, { as: "Document" });
db.notification.belongsTo(db.users, { as: "To" });
db.notification.belongsTo(db.users, { as: "From" });
// db.referral.belongsTo(db.client, { as: "Client" });
// db.referral.belongsTo(db.com, { as: "Company" });
// db.referral.belongsTo(db.users, { as: "Driver" });
// db.referral.belongsTo(db.delivery, { as: "Delivery" });
db.switch.belongsTo(db.referral, { as: "Referral" });
db.switch.belongsTo(db.users, { as: "Old" });
db.switch.belongsTo(db.users, { as: "New" });
/// Exports configuration
module.exports = db;