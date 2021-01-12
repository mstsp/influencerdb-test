const router = require("express").Router();
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const DEVICES_TABLE_NAME = process.env.DEVICES_TABLE_NAME;

router.get("/", async (req, res) => {
    let params = {
        TableName: DEVICES_TABLE_NAME,
        AttributesToGet: ["device_id", "name", "location"]
    };

    try {
        const data = await dynamoDb.scan(params).promise();
        res.json({data: data});

    } catch (err) {
        console.log(err);
    }
})

module.exports = router;
