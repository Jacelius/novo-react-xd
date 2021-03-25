from aws_cdk.core import App

from conf import AWS_CONF
from ui_stack import UiStack

app_deploy = App()

stacks = [
    {"name": "ui", "class": UiStack, "type": "extended"},
]
for stack in stacks:
    if stack.get("type") == "extended":
        base_name = AWS_CONF["extended_base_stack_name"]
        base_desc = AWS_CONF["extended_base_stack_desc"]
    else:
        base_name = AWS_CONF["base_stack_name"]
        base_desc = AWS_CONF["base_stack_desc"]

    cf_stack_name = f"{base_name}-{stack['name']}"
    cf_stack_desc = f"{stack['name']} stack | {base_desc}"
    stack["class"](
        app_deploy,
        cf_stack_name,
        description=cf_stack_desc,
        env=dict(AWS_CONF["env"]),
    )

app_deploy.synth()
