const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB({ convertEmptyValues: true });


exports.handler = (event, context, callback) => {
    console.log("request:", JSON.stringify(event, undefined, 2));
    let body = event.body
    let typical_header = { 'Content-Type': 'text/plain', 
    "Access-Control-Allow-Headers" : "Content-Type, Authorization",
    "Access-Control-Allow-Origin": "https://mail.google.com",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    "Access-Control-Allow-Credentials": true,}
    if (body == null) {
        callback(null, {
            statusCode: 418,
            headers: typical_header,
            body: 'No body'
        });
        return;
    }

    body = JSON.parse(body)
    // there are too many emails in the body. 
    if (body.emails.length > 25) {
      callback(null, {
        statusCode: 419,
        headers: typical_header,
        body: `Too many emails: ${body.emails}`
      });
      return;
    }
    let emailarr = []
    for (var i = 0; i < body.emails.length; i++) {
      // if any fields are empty or undefined, set them to null
      if (body.emails[i].emailuuid == null || body.emails[i].emailuuid == "") {
        body.emails[i].emailuuid = "empty"
      }
      if (body.emails[i].body == null || body.emails[i].body == "") {
        body.emails[i].body = "empty"
      }
      if (body.emails[i].subject == null || body.emails[i].subject == "") {
        body.emails[i].subject = "empty"
      }
      if (body.emails[i].date == null || body.emails[i].date == "") {
        body.emails[i].date = "empty"
      }
      if (body.emails[i].reciever == null || body.emails[i].reciever == "") {
        body.emails[i].reciever = "empty"
      }
      if (body.emails[i].sender == null || body.emails[i].sender == "") {
        body.emails[i].sender = "empty"
      }
      if (body.emails[i].labels == null || body.emails[i].labels == "") {
        body.emails[i].labels = "empty"
      }
      if (body.emails[i].threadid == null || body.emails[i].threadid == "") {
        body.emails[i].threadid = "empty"
      }

        let temp = {

            "PutRequest": {
                "Item": {
                  "emailuuid" : { "S":body.emails[i].emailuuid},
                  "body" : { "S": body.emails[i].body },
                  "subject": { "S": body.emails[i].subject },
                  "date": { "S": body.emails[i].date },
                  "reciever": { "S": body.emails[i].reciever },
                  "sender": { "S": body.emails[i].sender },
                  "labels": { "S": body.emails[i].labels },
                  "threadid": { "S": body.emails[i].threadid },
                }
            }
        }
        emailarr.push(temp)
    }
    let email_table = process.env.EMAIL_TABLE
    var params = {
      RequestItems: {
        [email_table] : emailarr
      }
    };
    dynamoDb.batchWriteItem(params, function(error, result) {
            // handle potential errors
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: typical_header,
          body: "wtf"
        });
        return 
      }
  
      // create a response
      callback(null, {
        statusCode: 200,
        headers: typical_header,
        body: `data: ${JSON.stringify(result)}`
      });
    });

    // dynamoDb.putItem(params, (error, result) => {
    //   // handle potential errors
    //   if (error) {
    //     console.error(error);
    //     callback(null, {
    //       statusCode: error.statusCode || 501,
    //       headers: { 'Content-Type': 'text/plain' },
    //       body: 'Could not get books.'
    //     });
    //     return 
    //   }
  
    //   // create a response
    //   callback(null, {
    //     statusCode: 200,
    //     headers: { "Content-Type": "text/plain" },
    //     body: `data: ${JSON.stringify(result.Items)}`
    //   });
    // });
  };