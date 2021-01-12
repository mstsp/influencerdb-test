const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const express = require("express");
const reports = require("./routes/reports");
const devices = require("./routes/devises");
const upload = require("./routes/upload");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.json({strict: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: false}))

app.use("/reports", reports);
app.use("/devices", devices);
app.use("/upload", upload);

module.exports.handler = serverless(app, {
    request: function (req, event, context) {
        req.context = event.requestContext;
    }
});
