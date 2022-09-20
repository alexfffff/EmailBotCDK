#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NomailCdkStack } from '../lib/nomail_cdk-stack';

const app = new cdk.App();
new NomailCdkStack(app, 'NomailCdkStack');
