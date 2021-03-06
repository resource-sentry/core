#!/usr/bin/env node

const Promise   = require('bluebird'),
      Logger    = require('@resource-sentry/utils/lib/logger'),
      parseArgs = require('minimist');

const resourceSentry = require('./index'),
      Manifest       = require('./manifest');

const packageJson = require('../package');
const logger = Logger('CLI');

Promise
    .resolve()
    .then(() => logger.verbose(`Resource Sentry, ver. ${packageJson.version}`))
    .then(() => {
        let args = parseArgs(process.argv);
        let manifest = new Manifest();
        let customConfigPath = args.config;

        if (customConfigPath !== undefined) {
            return manifest.loadManifest(customConfigPath);
        } else {
            return manifest.loadDefault();
        }
    })
    .then(manifest => resourceSentry(manifest));
