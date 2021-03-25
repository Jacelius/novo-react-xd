import json
import logging
import os
import re
import sys
from configparser import ConfigParser
from glob import glob

from invoke import task

logging.basicConfig(
    format="%(asctime)s %(levelname)s: (%(filename)s:%(lineno)d) %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger("root")


def _abs_path(directory):
    return os.path.join(
        os.path.dirname(os.path.realpath(__file__)),
        directory,
    )


def _branch_cmd(ctx):
    res = ctx.run("git branch --show-current")
    return res.stdout.strip()


def _depl_stage(branch_name):
    depl_stage = "tst"
    if branch_name == "master":
        depl_stage = "prd"
    elif branch_name == "dev":
        depl_stage = "dev"

    return depl_stage


def _file_paths(file):
    return glob(_abs_path(file))


def _locate_py_srcs(app_conf, py_dirs):
    py_srcs = [app_conf[src] for src in py_dirs]

    for file in _file_paths("**/*.py") + _file_paths("*.py"):
        if not any(path in file for path in py_srcs):
            py_srcs.append(file)

    return py_srcs


def _parse_config(conf_path):
    parsed_conf = ConfigParser()
    parsed_conf.read(conf_path)

    return parsed_conf


def _validate_app_paths(app_conf):
    for path in app_conf.values():
        if not os.path.isdir(path):
            logger.error(
                f"FIXME: {path} does not exist. Check parameters in {_SETUP_FILE}",
            )
            sys.exit(1)


def _read_app_config(conf_path):
    app_conf = {}

    def _parse_abs_dir(config_key):
        return _abs_path(parsed_conf["app"].get(config_key, ""))

    try:

        parsed_conf = _parse_config(conf_path)

        py_dirs = ("deploy",)
        app_conf = {
            config_key: _parse_abs_dir(f"dir_{config_key}")
            for config_key in py_dirs + ("node", "requirement")
        }
        _validate_app_paths(app_conf)

        py_mod_srcs = [
            app_conf[mod.strip()]
            for mod in parsed_conf["app"].get("python_modules", "").split(",")
            if mod
        ]

        app_conf.update(
            {
                "config_aws_account": _parse_abs_dir("config_aws_account"),
                "node_build_path": os.path.join(app_conf["node"], "dist"),
                "py_srcs": _locate_py_srcs(app_conf, py_dirs),
                "py_mod_srcs": py_mod_srcs,
                "yml_srcs": _file_paths("*.yml") + _file_paths("**/*.yml"),
            },
        )

    except (AttributeError, LookupError, OSError, TypeError, ValueError):
        logger.exception(f"FIXME: Set right parameters in {conf_path}")
        sys.exit(1)

    return app_conf


_SETUP_FILE = _abs_path("setup.cfg")
APP_CONF = _read_app_config(_SETUP_FILE)


@task
def build(ctx):
    if APP_CONF["node"]:
        ctx.run(f"npm run --prefix {APP_CONF['node']} build")
    else:
        logger.info(f"dir_node missing in {_SETUP_FILE}. NPM build not available.")


@task
def clean(ctx):
    patterns = [
        "*.egg-info",
        "**/*.pyc",
        "**/__pycache__",
        "cdk.json",
        "cdk.context.json",
        "cdk.out/",
    ]

    if APP_CONF["node"]:
        patterns.extend(
            [
                f"{APP_CONF['node']}/dist/",
                f"{APP_CONF['node']}/.cache/",
                f"{APP_CONF['node']}/node_modules/",
            ],
        )
    else:
        logger.info(
            f"dir_node missing in {_SETUP_FILE}. "
            "Cleaning NPM directories not available.",
        )

    for pattern in patterns:
        ctx.run(f"rm -rf {_abs_path(pattern)}")


@task
def setup(ctx, azure_env=False, dev_env=False):
    py_build_packages = ("pip", "setuptools")
    for package in py_build_packages:
        ctx.run(f"pip install --upgrade {package}")

    requirement_file = None

    # install deployment tool aws cdk
    npm_opts = [f"--prefix {APP_CONF['node']}"]
    if azure_env or dev_env:
        ctx.run("npm install -g aws-cdk --save-dev")
    else:
        npm_opts.append("--only=production")

    # for CI/CD tools
    if azure_env:
        requirement_file = "azure"

    # for local extra dev tools
    if dev_env:
        requirement_file = "dev"

    if requirement_file:
        requirement_file = (
            f"{os.path.join(APP_CONF['requirement'], requirement_file)}.txt"
        )
        if os.path.isfile(requirement_file):
            ctx.run(f"pip install -r {requirement_file}")
    else:
        logger.info("Only installing node dependencies.")

    # install node dependencies
    ctx.run(f"npm install {' '.join(npm_opts)}")


@task
def deploy(
    ctx,
    azure_env=False,
    build_branch=None,
    profile="dev",
    repo=None,
    source_branch=None,
):
    if build_branch == "merge" and source_branch:
        branch = source_branch.split("/")[-1].strip()
        depl_stage = "tst"
    elif build_branch:
        branch = build_branch
        depl_stage = _depl_stage(build_branch)
    else:
        branch = _branch_cmd(ctx)
        depl_stage = _depl_stage(branch)
        # prohibit local deploy to prd
        if branch == "master":
            logger.warning(
                "Deploying master branch to prd environment locally is prohibited.",
            )
            sys.exit(1)

    if not repo:
        res = ctx.run("git config --get remote.origin.url")
        repo = res.stdout.split("/")[-1].strip()

    logger.info(
        "Extracted git vars\n"
        f"repo: {repo}\ndeployment stage: {depl_stage}\nbranch: {branch}\n"
        f"input build_branch: {build_branch}\n"
        f"input source_branch: {source_branch}",
    )

    env_vars = {
        "APP_CONFIG": json.dumps(APP_CONF),
        "DEPLOYMENT_STAGE": depl_stage,
        "BRANCH": branch,
        "REPO": repo,
    }

    cdk_app_path = os.path.join(APP_CONF["deploy"], "app.py")
    cdk_opts = [f'--app="python {cdk_app_path}"', "--require-approval never"]

    if azure_env:
        cdk_opts.append("--ci")

    else:
        env_vars["LOCAL_PROFILE"] = profile

        # sync all SSO profile credentials
        res = ctx.run(f"yawsso -p {profile}")
        if "No appropriate credentials found for profile" in res.stdout:
            logger.error(
                f"FIXME: Login to AWS SSO with: aws sso login --profile {profile}",
            )
            sys.exit(1)
        cdk_opts.append(f"--profile {profile}")

    ctx.run(f"cdk synth {' '.join(cdk_opts)}", env=env_vars)

    cdk_deploy_cmd = f"cdk deploy --all {' '.join(cdk_opts)}"
    res = ctx.run(cdk_deploy_cmd, env=env_vars, warn=True)

    # on the very first run the AWS environment needs to be bootstrapped
    if res.failed:
        bootstrap_err = (
            "Error: This stack uses assets, "
            "so the toolkit stack must be deployed to the environment"
        )
        cmd_match = re.search(fr'{bootstrap_err} \(Run "(.+)"\)', res.stderr)
        if cmd_match:
            cdk_bootstrap_cmd = cmd_match.group(1)
            if azure_env:
                ctx.run(f"{cdk_bootstrap_cmd} --ci --require-approval never")
            else:
                ctx.run(f"{cdk_bootstrap_cmd} --profile {profile}")

            ctx.run(cdk_deploy_cmd, env=env_vars)

        else:
            logger.error(f"{cdk_deploy_cmd} failed.")
            sys.exit(1)


@task
def dev(ctx, autoformat=False, lint=False, test=False):
    if autoformat:
        ctx.run(f"npm run --prefix {APP_CONF['node']} format")
        for src_path in APP_CONF["py_srcs"]:
            ctx.run(f"black {src_path}")

    if lint:
        ctx.run(f"npm run --prefix {APP_CONF['node']} lint")

        for src_path in APP_CONF["yml_srcs"]:
            logger.info(f"Linting {src_path} with yamllint.")
            ctx.run(f"yamllint {src_path}")

        for src_path in APP_CONF["py_srcs"]:
            logger.info(f"Linting {src_path} with flake8/isort.")
            ctx.run(f"flake8 --show-source {src_path}")
            ctx.run(f"isort --check-only --diff {src_path}")

            if src_path in APP_CONF["py_mod_srcs"]:
                logger.info(f"Linting {src_path} with pylint.")

                pylint_opts = [f"--rcfile={_SETUP_FILE}"]
                # in tests some rules are not applicable
                if src_path.endswith("test"):
                    pylint_opts.append("--disable=R0913,W0212,W0511,W0613,W0621")

                ctx.run(f"pylint {' '.join(pylint_opts)} {src_path}")
