#!/usr/bin/env node

const Promise = require('bluebird');

const resourceSentry = require('./index'),
      Logger         = require('./util/logger'),
      Manifest       = require('./manifest');

const packageJson = require('../package');
const logger = Logger('CLI');

Promise
    .resolve()
    .then(() => logger.verbose(`Resource Sentry, ver. ${packageJson.version}`))
    .then(() => new Manifest().loadDefault())
    .then(manifest => resourceSentry(manifest));
