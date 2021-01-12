const router = require("express").Router();
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const REPORTS_TABLE_NAME = process.env.REPORTS_TABLE_NAME;
const DEVICES_TABLE_NAME = process.env.DEVICES_TABLE_NAME;

router.post("/", async (req, res) => {
    // const item = req;
    const file = req.files.file;
    const fileType = await getFileExtension(file);
    let TableName = null;
    let fileContent = file.data.toString('utf8').split('\n')
    let items = []
    if(fileType === 'txt') {
        TableName = REPORTS_TABLE_NAME
        items = await parseTXTFormat(fileContent)
    } else if(fileType === 'csv') {
        TableName = DEVICES_TABLE_NAME
        items = await parseCSVFormat(fileContent)
        items.pop()
    } else {
        res.status(500).send('Is not correct format');
    }

    const params = {
        RequestItems: {
            [TableName]: items
        }
    };

    dynamoDb.batchWrite(params, function(err, data) {

        if (err) {
            console.log(err);
            res.json({err: err});
        }
        else  {
            res.json({response: 'SAVED!!!'});
        }
    });
  //  res.json({params: params});

})

const getFileExtension = (file) => {
    return file.name.split('.')[1]
};

const parseTXTFormat = async (array) => {
    let items = []
    for (let i = 0; i < array.length - 1; i++) {
        let lineFormat = getLineFormat(array[i])
        if(lineFormat === 'json') {
            let item = JSON.parse(array[i])
            items.push({
                PutRequest: {
                    Item: {
                        id: uuidv4(),
                        device_id: item.id,
                        device_timestamp: item.ts,
                        device_value: item.value,
                    }
                }
            })
        } else {
            let itemData = array[i].trim().split('\\t')
            let timestamp = Number(itemData[1].replace(/[\u200B-\u200D\uFEFF]/g, ''))
            items.push({
                PutRequest: {
                    Item: {
                        id: uuidv4(),
                        device_id: itemData[0],
                        device_timestamp: new Date(timestamp).toISOString(),
                        device_value: itemData[2],
                    }
                }
            })
        }
    }

    return items
}

const parseCSVFormat = (array) => {
    return  array.map((el) => {
        let array = el.split(',');
        return ({
            PutRequest: {
                Item: {
                    id: uuidv4(),
                    device_id: array[0],
                    name: array[1],
                    location: array[2],
                }
            }
        })
    })
}

const getLineFormat = (line) => {
    return line.includes('\\t') ? 'tsv' : 'json'
}

const getDeviceInfo = async (id) => {
    let deviceParams = {
        TableName: DEVICES_TABLE_NAME,
        FilterExpression: 'device_id = :device_id',
        ExpressionAttributeValues: {':device_id':  id}
    };

    try {
        const device = await dynamoDb.scan(deviceParams).promise()
        return device.Items[0]
    } catch (err) {
        return {error: err}
    }
}
module.exports = router;
