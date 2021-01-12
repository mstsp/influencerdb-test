const router = require("express").Router();
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const REPORTS_TABLE_NAME = process.env.REPORTS_TABLE_NAME;
const DEVICES_TABLE_NAME = process.env.DEVICES_TABLE_NAME;

router.post("/", async (req, res) => {
    const date = req.body.date;
    const devicesArr = await getDevices();
    const dataArray = await getItemsPerPeriod(date);

    let groupedById = dataArray.reduce(function (reducer, acc) {
        let hours = new Date(acc.device_timestamp).getHours()
        reducer[hours] = reducer[hours] || [];
        reducer[hours].push(acc);
        return reducer;
    }, Object.create(null));

    let data = []
    let items = Object.entries(groupedById)
    for (let i = 0; i < items.length; i++) {
        let devices = items[i][1]
        let time = items[i][0]

        let sortedByDevice = devices.reduce(function (previousValue, currentItem) {
            previousValue[currentItem.device_id] = previousValue[currentItem.device_id] || [];
            previousValue[currentItem.device_id].push(currentItem);
            return previousValue;
        }, Object.create(null));

        let sortedByDeviceArr = Object.entries(sortedByDevice)
        let devicesStatisticForPeriod = []
        sortedByDeviceArr.forEach((element) => {
            let device_id = element[0];
            let deviceValues = element[1].map(({device_value}) => device_value);
            let max = Math.max(...deviceValues);
            let min = Math.min(...deviceValues);
            let totalSum = deviceValues.reduce((acc, val) => {
                return Number(acc) + Number(val);
            }, 0);
            let avg = totalSum / deviceValues.length;
            let medianIndex;
            deviceValues.length % 2 === 0 ? medianIndex = (deviceValues.length / 2) + 1 : medianIndex = Math.floor(deviceValues.length / 2)
            devicesStatisticForPeriod.push({
                device_id: device_id,
                max: max,
                min: min,
                avg: avg,
                median: deviceValues[medianIndex],
                device_info: getDeviceInfo(device_id, devicesArr)
            })
        });
        data.push(
            {
                period_start: time,
                statistic: devicesStatisticForPeriod
            }
        );
    }

    res.json({data: data });

})
const getItemsPerPeriod = async (date) => {
    let results = [];
    const params = {
        TableName: REPORTS_TABLE_NAME,
        FilterExpression: 'contains (device_timestamp, :device_timestamp)',
        ExpressionAttributeValues: {':device_timestamp': date}
    };

    try {
        const data = await dynamoDb.scan(params).promise();
        if (data.Count > 0) {
            results = data.Items
        }
    } catch (err) {
        console.log(err);
    };

    return results
}

const getDevices = async (id) => {
    let results;
    let params = {
        TableName: DEVICES_TABLE_NAME,
        AttributesToGet: ["device_id", "name", "location"]
    };

    try {
        results = await dynamoDb.scan(params).promise();
    } catch (err) {
        console.log(err);
    }

    return results.Items;
}
const getDeviceInfo = (id, devices) => {
    return devices.find((el) => el.device_id === id)
}

module.exports = router;
