import { CfnOutput, StackProps, Stack, aws_codecommit, aws_ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { Network } from './construct/network';

interface ClosedNetworkStackProps extends StackProps {
  /*
  allowedIpV4AddressRanges: string[] | null;
  allowedIpV6AddressRanges: string[] | null;
  allowedCountryCodes: string[] | null;
  hostName?: string;
  domainName?: string;
  hostedZoneId?: string;
  */

  //closedNetworkEnabled: boolean;
  hybridNetworkEnabled: boolean;
  virtualClientEnabled: boolean;
      closedNetworkCidr: string; //'10.255.0.0/16', // '10.0.0.0/16',
      hybridNetworkCidr: string; //'10.254.0.0/16', // '10.1.0.0/16',
      maxAzs: number;
      //cidr: string;
      cidrMask: number;
      publicSubnet?: boolean;
      isolatedSubnet?: boolean;
      natSubnet?: boolean;
  
}

export class ClosedNetworkStack extends Stack {
  public readonly closedNetworkVpc: aws_ec2.Vpc;
  public readonly hybridNetworkVpc: aws_ec2.Vpc;

  /*
  public readonly webAclArn: string;
  public readonly webAcl: CommonWebAcl;
  public readonly cert: ICertificate;
  */

  constructor(scope: Construct, id: string, props: ClosedNetworkStackProps) {
    super(scope, id, props);

    // Create networking resources
    const closedNetwork = new Network(this, `ClosedVpc`, {
      maxAzs: props.maxAzs,
      cidr: props.closedNetworkCidr,
      cidrMask: props.cidrMask,
      publicSubnet: props.publicSubnet,
      isolatedSubnet: props.isolatedSubnet,
      natSubnet: props.natSubnet,

      /*
      cidr: '10.0.0.0/16',
      cidrMask: 24,
      publicSubnet: false,
      isolatedSubnet: true,
      maxAzs: 2,
      */
    });
    this.closedNetworkVpc = closedNetwork.vpc;
    
    if (props.hybridNetworkEnabled) {
      // Create networking resources
      const hybridNetwork = new Network(this, `HybridVpc`, {
        maxAzs: props.maxAzs,
        cidr: props.hybridNetworkCidr,
        cidrMask: props.cidrMask,
        publicSubnet: props.publicSubnet,
        isolatedSubnet: props.isolatedSubnet,
        natSubnet: props.natSubnet,

        /*
        cidr: '10.0.0.0/16',
        cidrMask: 24,
        publicSubnet: false,
        isolatedSubnet: true,
        maxAzs: 2,
        */
      });
      this.hybridNetworkVpc = hybridNetwork.vpc;
    }
    
    if (props.virtualClientEnabled) {
      /*
      // セキュリティグループ
      const ec2SecurityGroup = new ec2.SecurityGroup(this, 'ec2SecurityGroup', {
        vpc,
      });
      const vpcEndpointSecurityGroup = new ec2.SecurityGroup(
        this,
        'vpcEndpointSecurityGroup',
        {
          vpc,
        }
      );
      vpcEndpointSecurityGroup.addIngressRule(
        ec2SecurityGroup,
        ec2.Port.allTraffic()
      );

      // VPC エンドポイント
      const privateApiVpcEndpoint = new ec2.InterfaceVpcEndpoint(
        this,
        'privateApiVpcEndpoint',
        {
          vpc,
          service: ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
          subnets: { subnets: vpc.publicSubnets },
          securityGroups: [vpcEndpointSecurityGroup],
          open: false,
        }
      );

      const ec2Instance = new ec2.Instance(this, 'ec2Instance', {
        vpc,
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.T4G,
          ec2.InstanceSize.NANO
        ),
        machineImage: new ec2.AmazonLinuxImage({
          generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
          cpuType: ec2.AmazonLinuxCpuType.ARM_64,
        }),
        securityGroup: ec2SecurityGroup,
        role: new iam.Role(this, 'ec2Role', {
          managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName(
              'AmazonSSMManagedInstanceCore'
            ),
          ], // セッションマネージャーを利用するために必要なポリシー
          assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        }),
      });
      */
    }
      
    /*
    if (
      props.allowedIpV4AddressRanges ||
      props.allowedIpV6AddressRanges ||
      props.allowedCountryCodes
    ) {
      const webAcl = new CommonWebAcl(this, `WebAcl${id}`, {
        scope: 'CLOUDFRONT',
        allowedIpV4AddressRanges: props.allowedIpV4AddressRanges,
        allowedIpV6AddressRanges: props.allowedIpV6AddressRanges,
        allowedCountryCodes: props.allowedCountryCodes,
      });

      new CfnOutput(this, 'WebAclId', {
        value: webAcl.webAclArn,
      });
      this.webAclArn = webAcl.webAclArn;
      this.webAcl = webAcl;
    }

    if (props.hostName && props.domainName && props.hostedZoneId) {
      const hostedZone = HostedZone.fromHostedZoneAttributes(
        this,
        'HostedZone',
        {
          hostedZoneId: props.hostedZoneId,
          zoneName: props.domainName,
        }
      );
      const cert = new Certificate(this, 'Cert', {
        domainName: `${props.hostName}.${props.domainName}`,
        validation: CertificateValidation.fromDns(hostedZone),
      });
      this.cert = cert;
    }
    */
  }
}

/*
import { Stack, StackProps, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cw from 'aws-cdk-lib/aws-cloudwatch';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
*/

/*
export interface DashboardStackProps extends StackProps {
  userPool: cognito.UserPool;
  userPoolClient: cognito.UserPoolClient;
  appRegion: string;
}

export class DashboardStack extends Stack {
  public readonly logGroup: logs.LogGroup;
  public readonly dashboard: cw.Dashboard;

  constructor(scope: Construct, id: string, props: DashboardStackProps) {
    super(scope, id, props);

    // packages/cdk/lib/construct/api.ts に合わせてデフォルト値を設定
    const modelIds: string[] = this.node.tryGetContext('modelIds') || [
      'anthropic.claude-3-sonnet-20240229-v1:0',
    ];
    const imageGenerationModelIds: string[] = this.node.tryGetContext(
      'imageGenerationModelIds'
    ) || ['stability.stable-diffusion-xl-v1'];

    // Bedrock のログの出力先として設定する LogGroup
    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      // 1 年でリテンションする設定
      retention: logs.RetentionDays.ONE_YEAR,
    });

    const inputTokenCounts = modelIds.map((modelId: string) => {
      return new cw.Metric({
        namespace: 'AWS/Bedrock',
        metricName: 'InputTokenCount',
        dimensionsMap: {
          ModelId: modelId,
        },
        period: Duration.days(1),
        statistic: 'Sum',
      });
    });

    const outputTokenCounts = modelIds.map((modelId: string) => {
      return new cw.Metric({
        namespace: 'AWS/Bedrock',
        metricName: 'OutputTokenCount',
        dimensionsMap: {
          ModelId: modelId,
        },
        period: Duration.days(1),
        statistic: 'Sum',
      });
    });

    const invocations = [...modelIds, ...imageGenerationModelIds].map(
      (modelId: string) => {
        return new cw.Metric({
          namespace: 'AWS/Bedrock',
          metricName: 'Invocations',
          dimensionsMap: {
            ModelId: modelId,
          },
          period: Duration.days(1),
          statistic: 'Sum',
        });
      }
    );

    const userPoolMetrics = [
      'SignInSuccesses',
      'TokenRefreshSuccesses',
      'SignUpSuccesses',
    ].map((metricName: string) => {
      return new cw.Metric({
        namespace: 'AWS/Cognito',
        metricName,
        dimensionsMap: {
          UserPool: props.userPool.userPoolId,
          UserPoolClient: props.userPoolClient.userPoolClientId,
        },
        period: Duration.hours(1),
        statistic: 'Sum',
        region: props.appRegion,
      });
    });

    const dashboard = new cw.Dashboard(this, 'Dashboard', {
      defaultInterval: Duration.days(7),
    });

    dashboard.addWidgets(
      new cw.TextWidget({
        markdown: '**Amazon Bedrock Metrics**',
        width: 18,
        height: 1,
      }),
      new cw.TextWidget({
        markdown: '**User Metrics**',
        width: 6,
        height: 1,
      })
    );

    dashboard.addWidgets(
      new cw.GraphWidget({
        title: 'InputTokenCount (Daily)',
        width: 6,
        height: 6,
        left: inputTokenCounts,
      }),
      new cw.GraphWidget({
        title: 'OutputTokenCount (Daily)',
        width: 6,
        height: 6,
        left: outputTokenCounts,
      }),
      new cw.GraphWidget({
        title: 'Invocations (Daily)',
        width: 6,
        height: 6,
        left: invocations,
      }),
      new cw.GraphWidget({
        title: 'UserPool',
        width: 6,
        height: 6,
        left: userPoolMetrics,
      })
    );

    dashboard.addWidgets(
      new cw.TextWidget({
        markdown: '**Prompt Logs**',
        width: 24,
        height: 1,
      })
    );

    // ログの出力から抜き出す
    dashboard.addWidgets(
      new cw.LogQueryWidget({
        title: 'Prompt Logs',
        width: 24,
        height: 6,
        logGroupNames: [logGroup.logGroupName],
        view: cw.LogQueryVisualizationType.TABLE,
        queryLines: [
          "filter @logStream = 'aws/bedrock/modelinvocations'",
          "filter schemaType like 'ModelInvocationLog'",
          'filter concat(input.inputBodyJson.prompt, input.inputBodyJson.messages.0.content.0.text) not like /.*<conversation>.*/ /*',
          'sort @timestamp desc',
          'fields @timestamp, concat(input.inputBodyJson.prompt, input.inputBodyJson.messages.0.content.0.text) as input, modelId',
        ],
      })
    );

    this.logGroup = logGroup;
    this.dashboard = dashboard;

    new CfnOutput(this, 'BedrockLogGroup', {
      value: this.logGroup.logGroupName,
    });

    new CfnOutput(this, 'DashboardName', {
      value: this.dashboard.dashboardName,
    });

    new CfnOutput(this, 'DashboardUrl', {
      value: `https://console.aws.amazon.com/cloudwatch/home#dashboards/dashboard/${this.dashboard.dashboardName}`,
    });
  }
}
*/
