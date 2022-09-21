import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class NomailCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {

    super(scope, id, props);
    const emailTable = new Table(this, 'emailTable', {
      partitionKey: { name: 'emailuuid', type: AttributeType.STRING }
    });
    const accountTable = new Table(this, 'accountTable', {
      partitionKey: { name: 'emailaddress', type: AttributeType.STRING }
    });

  }
}
