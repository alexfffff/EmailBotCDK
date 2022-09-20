import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class NomailCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {

    super(scope, id, props);
    const table = new Table(this, 'Hits', {
      partitionKey: { name: 'path', type: AttributeType.STRING }
  });
  }
}
