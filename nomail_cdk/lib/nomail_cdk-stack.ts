import { Duration, Stack, StackProps,CfnOutput } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { LambdaIntegration, LambdaRestApi, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class NomailCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {

    super(scope, id, props);
    const emailTable = new Table(this, 'emailTable', {
      partitionKey: { name: 'emailuuid', type: AttributeType.STRING }
    });
    const accountTable = new Table(this, 'accountTable', {
      partitionKey: { name: 'emailaddress', type: AttributeType.STRING }
    });


    const send_data_function = new Function(this, 'send_data_lambda', {
      runtime: Runtime.NODEJS_14_X,    // execution environment
      functionName: 'send_data',
      code: Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'send_data.handler',                // file is "hello", function is "handler"
      environment: {
        'EMAIL_TABLE': emailTable.tableName,
        'ACCOUNT_TABLE': accountTable.tableName
      }
    });
    const test_function = new Function(this, 'test_lambda', {
      runtime: Runtime.NODEJS_14_X,    // execution environment
      functionName: 'test',
      code: Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'test.handler',                // file is "hello", function is "handler"
      environment: {
        'EMAIL_TABLE': emailTable.tableName,
        'ACCOUNT_TABLE': accountTable.tableName
      }
    });


    // giving permissions
    send_data_function.addToRolePolicy(new PolicyStatement({
      actions: ['dynamodb:PutItem', 'dynamodb:GetItem', 'dynamodb:Scan', "dynamodb:BatchWriteItem"],
      resources: [emailTable.tableArn, accountTable.tableArn]
    }));
    emailTable.grantReadWriteData(send_data_function);


    // create rest api with lambda integration
    const api = new RestApi(this, 'emailApi');
    new CfnOutput(this, 'apiUrl', {value: api.url});

    //add a /send_data resource
    const send_data = api.root.addResource('send_data');
    const send_data_integration = new LambdaIntegration(send_data_function);
    send_data.addMethod(
      'POST',
      send_data_integration,
    );
    const test = api.root.addResource('test');
    const test_integration = new LambdaIntegration(test_function);
    test.addMethod(
      'POST',
      test_integration,
    );



  }
}
