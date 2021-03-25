import boto3
from aws_cdk.aws_elasticloadbalancingv2 import (
    ApplicationListener,
    ApplicationListenerRule,
    ApplicationLoadBalancer,
    ListenerAction,
    ListenerCondition,
)
from aws_cdk.aws_route53 import ARecord, PrivateHostedZone, RecordTarget
from aws_cdk.aws_route53_targets import LoadBalancerTarget
from aws_cdk.aws_s3 import Bucket
from aws_cdk.aws_s3_deployment import BucketDeployment, Source
from aws_cdk.core import Arn, ArnComponents, Construct, Stack

from conf import AWS_CONF


def _next_elb_priority(branch_host, listener_arn):
    """Get current priorities from listener rules at runtime."""
    session = boto3.session.Session(
        profile_name=AWS_CONF["optionals"]["local_profile"],
        region_name=AWS_CONF["env"]["region"],
    )
    client = session.client(service_name="elbv2")
    resp = client.describe_rules(ListenerArn=listener_arn)

    priorities = [0]
    for rule in resp["Rules"]:
        if rule["Priority"] == "default":
            continue

        priority = int(rule["Priority"])
        if any(branch_host in cond["Values"] for cond in rule["Conditions"]):
            return priority

        priorities.append(priority)

    return max(priorities) + 1


class UiStack(Stack):
    def __init__(self, scope: Construct, app_id: str, **kwargs) -> None:
        super().__init__(scope, app_id, **kwargs)

        # bucket with ui contents can be reached over listener rule on ALB
        api_domain_name = "static." + AWS_CONF["private_base_domain"]
        host_domain = f"{AWS_CONF['app_name']}.{AWS_CONF['private_base_domain']}"
        s3_path = AWS_CONF["app_name"]
        if AWS_CONF["deployment_stage"] == "tst":
            host_domain = f"{AWS_CONF['branch_id']}." + host_domain
            s3_path += "-" + AWS_CONF["branch_path"]

        ui_bucket = Bucket.from_bucket_name(
            self,
            "UiBucket",
            bucket_name=AWS_CONF["optionals"]["ui_bucket"],
        )
        BucketDeployment(
            self,
            "UiBucketDepl",
            destination_bucket=ui_bucket,
            destination_key_prefix=s3_path,
            sources=[Source.asset(AWS_CONF["optionals"]["node_build_path"])],
        )

        # ALB rule for http redirect to https
        load_balancer_arn = Arn.format(
            components=ArnComponents(
                service="elasticloadbalancing",
                partition="aws",
                resource="loadbalancer/app",
                resource_name=AWS_CONF["optionals"]["alb"],
            ),
            stack=self,
        )
        alb = ApplicationLoadBalancer.from_lookup(
            self,
            "AlbApi",
            load_balancer_arn=load_balancer_arn,
        )
        listener_http = ApplicationListener.from_lookup(
            self,
            "AlbHttpListenerRule",
            load_balancer_arn=alb.load_balancer_arn,
            listener_port=80,
        )

        # listener rule priority is mandatory input and needs to be looked up
        # if cdk context not set yet set fixed priority during cdk synth
        priority = 1
        if AWS_CONF["env"]["account"] in listener_http.listener_arn:
            priority = _next_elb_priority(host_domain, listener_http.listener_arn)

        # the rule is added to the existing listener
        ApplicationListenerRule(
            self,
            f"ListenerRule{AWS_CONF['branch_id'].capitalize()}",
            listener=listener_http,
            priority=priority,
            action=ListenerAction.redirect(
                host=api_domain_name,
                path=f"/ui/{s3_path}/index.html",
                permanent=True,
                port="443",
                protocol="HTTPS",
            ),
            conditions=[ListenerCondition.host_headers([host_domain])],
        )

        # route 53 private zone with listener rule for redirect to alb
        ARecord(
            self,
            f"ARecord{AWS_CONF['branch_id'].capitalize()}",
            record_name=host_domain,
            target=RecordTarget(alias_target=LoadBalancerTarget(alb)),
            zone=PrivateHostedZone.from_lookup(
                self,
                "PrivZoneCorp",
                domain_name=AWS_CONF["private_base_domain"],
                private_zone=True,
                vpc_id=AWS_CONF["optionals"]["vpc"],
            ),
        )
