import json
import logging
import os
import re
import sys

from pyrsistent import freeze

logging.basicConfig(
    format="%(asctime)s %(levelname)s: (%(filename)s:%(lineno)d) %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger("root")


def _find_branch_id(branch_name, branch_path):
    if branch_name in ("dev", "master"):
        return branch_name

    matched_id = re.search(r"^(?:[0-9]+\.)?([0-9]+)\..+", branch_name)
    if matched_id:
        return matched_id.group(1)[:6]

    return branch_path[:6]


def _merge_with_pipe_sep(data_dict):
    return " | ".join(f"{key}: {val}" for key, val in data_dict.items())


def _read_aws_acc_conf(aws_acc_conf_path, depl_stage):
    try:

        with open(aws_acc_conf_path, "r") as file_pointer:
            aws_acc_conf = json.load(file_pointer)

        aws_acc = aws_acc_conf["env"][depl_stage]
        aws_acc["region"] = aws_acc_conf["default_region"]

        account_name = aws_acc_conf["account_name"].upper()
        aws_acc["account_name"] = f"{account_name}-{depl_stage.upper()}"

        return aws_acc

    except (AttributeError, LookupError, OSError, TypeError, ValueError):

        if aws_acc_conf_path:
            err = f"FIXME: Missing accounts in {aws_acc_conf_path}"
        else:
            err = "FIXME: Please set config_aws_account in setup.cfg"

        logger.exception(err)
        sys.exit(1)


def _replace_symbols(text, symbols, repl="-"):
    for symbol in symbols:
        text = text.replace(symbol, repl)

    return text


def _update_lambda_info(aws_lambdas, app_name, branch_name, repo_name):
    for lmda in aws_lambdas:
        lmda["name"] = f"{app_name}-{lmda['trigger']}-{lmda['short_name']}"

        lmda["description"] = _merge_with_pipe_sep(
            {"repo": repo_name, "branch": branch_name, "trigger": lmda["trigger"]},
        )


def _create_aws_conf():
    # pylint: disable=too-many-locals
    aws_conf = {}

    # from tasks.py
    app_conf = json.loads(os.getenv("APP_CONFIG"))
    branch_name = os.getenv("BRANCH")
    depl_stage = os.getenv("DEPLOYMENT_STAGE")
    local_profile = os.getenv("LOCAL_PROFILE")
    pip_extra_index_url = os.getenv("PIP_EXTRA_INDEX_URL")
    repo_name = os.getenv("REPO")

    aws_acc = _read_aws_acc_conf(app_conf["config_aws_account"], depl_stage)

    project_parts = repo_name.split("-")
    app_name = project_parts[0]
    project_abbrv = project_parts[-1]

    branch_path = _replace_symbols(branch_name, "_.")
    branch_id = _find_branch_id(branch_name, branch_path)

    base_stack_name = f"{repo_name}-{depl_stage}"
    base_stack_desc_params = {"repo": repo_name, "env": depl_stage}
    programming_lang = "aws"
    if len(project_parts) > 2:
        programming_lang = project_parts[1]
        base_stack_desc_params["lang"] = programming_lang

    base_stack_desc = _merge_with_pipe_sep(base_stack_desc_params)

    ext_base_stack_name = f"{base_stack_name}-{branch_id}"
    ext_base_stack_desc_params = base_stack_desc_params.copy()
    ext_base_stack_desc_params["branch"] = branch_name
    ext_base_stack_desc = _merge_with_pipe_sep(ext_base_stack_desc_params)

    aws_lambdas = app_conf.get("aws_lambdas", [])
    _update_lambda_info(aws_lambdas, app_name, branch_name, repo_name)

    private_base_domain = f"{project_abbrv}-{depl_stage}.corp.aws.novonordisk.com"

    aws_conf["optionals"] = {
        "doc_build_path": app_conf.get("doc_build_path"),
        "node_build_path": app_conf.get("node_build_path"),
        "lambdas": aws_lambdas,
        "local_profile": local_profile,
        "pip_extra_index_url": pip_extra_index_url,
    }
    aws_conf["optionals"].update(
        {
            opt_resource: aws_acc.get(opt_resource)
            for opt_resource in (
                "alb",
                "api",
                "api_auth",
                "api_root",
                "doc_bucket",
                "ssl_cert",
                "ui_bucket",
                "tier1_subnets",
                "tier2_subnets",
                "vpc",
            )
        },
    )

    aws_conf.update(
        {
            "account_name": aws_acc["account_name"],
            "app_name": app_name,
            "base_stack_desc": base_stack_desc,
            "base_stack_name": base_stack_name,
            "branch_name": branch_name,
            "branch_id": branch_id,
            "branch_path": branch_path,
            "extended_base_stack_desc": ext_base_stack_desc,
            "extended_base_stack_name": ext_base_stack_name,
            "deployment_stage": depl_stage,
            "env": {"account": aws_acc["account"], "region": aws_acc["region"]},
            "private_base_domain": private_base_domain,
            "programming_lang": programming_lang,
            "project_abbrv": project_abbrv,
        },
    )

    # check for missing values
    for conf_key, conf_val in aws_conf.items():
        if conf_key == "optionals":
            continue

        if conf_val is None:
            logger.exception(
                f"FIXME: Configuration value for {conf_key} is unspecified",
            )
            sys.exit(1)

    return aws_conf


AWS_CONF = freeze(_create_aws_conf())
