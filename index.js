const express = require("express");
const app = require("express")();
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
// const privateKey = fs.readFileSync('./ssl/key.key');
// const certificate = fs.readFileSync('./ssl/crt.crt');


/// Middleware sets in applications
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/// Database configuration
const db = require("./app/models");
//  db.sequelize.sync({ force: true });
db.sequelize.sync();

/// Sockets initialization
// const http = require('https').createServer({
//     key: privateKey,
//     cert: certificate
// }, app);

const http = require("http").createServer(app);
var io = require("socket.io")(http);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/images", express.static(__dirname + "/images"));

require("./app/sockets/socket")(io);
require("./app/routes/auth.routes")(app);
require("./app/routes/driver.routes")(app);
require("./app/routes/helper.routes")(app);
require("./app/routes/company.routes")(app);
require("./app/routes/client.routes")(app);
require("./app/routes/admin.routes")(app);
require("./app/routes/file.routes")(app);
require("./app/routes/referral.routes")(app);
require("./app/routes/datasul.routes")(app);
require("./app/routes/location.routes")(app);
require("./app/routes/root.routes")(app);
require("./app/routes/document.routes")(app);
require("./app/routes/term.routes")(app);
require("./app/routes/version.routes")(app);
require("./app/routes/switch.routes")(app);
require("./app/routes/session.routes")(app);

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
