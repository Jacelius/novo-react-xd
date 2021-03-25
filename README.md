# Sample flow analytics React App

This repo hosts a website with sample flow analytics.

## Development Information

### Installation

* Run below to install Node/React and python/aws cdk dependencies.
* It is advised to create a virtual environment.

```bash
pip install inv
inv setup --dev-env
```

### React testing

Parcel is the used build tool and will open port 1234 by default.

```bash
# switch to directory containing frontend
$ npm run --prefix pca/ dev
Server running at http://localhost:38849 - configured port 1234 could not be used.
[...]
```

## Build React app

The invoke command triggers `npm run build` with the defined directory in `setup.cfg`.

```bash
inv build
```

Clean built files run:

```bash
inv clean
```

## Linter

```bash
inv dev --lint
```

To format frontend related files in place:

```bash
npm run --prefix pca/ format
```

## Deploy to AWS

To deploy to AWS using cdk run:

```bash
inv deploy
```
