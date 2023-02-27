const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {
  // fetch all todos from the database
  // dynamoDb.scan(params, (error, result) => {
  //   // handle potential errors
  //   if (error) {
  //     console.error(error);
  //     callback(null, {
  //       statusCode: error.statusCode || 501,
  //       headers: { 'Content-Type': 'text/plain' },
  //       body: 'Could not get books.'
  //     });
  //     return;
  //   }

  //   // create a response
  //   const response = {
  //     statusCode: 200,
  //     body: JSON.stringify(result.Items) + '\n' + JSON.stringify(event)
  //   };
  //   callback(null, response);
  // });
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type, Authorization",
      "Access-Control-Allow-Origin": "https://mail.google.com",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(event)
  };
  callback(null,response)
};