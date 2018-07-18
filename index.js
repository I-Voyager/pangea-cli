#!/usr/bin/env node
const program = require('commander');
const { prompt } = require('inquirer');
const { newSigningKey, signingKeyChangePW, dappStreaming } = require('./src/cliActions');
const { newSigningKeySchema, changePasswordSigningKeySchema, buildBundleFileSchema } = require('./src/promtSchema');

program
  .version(require(`./package.json`).version, '-v, --version');

program
  .command('sk:new')
  .description('Generate new signing key')
  .action(() => {
    prompt(newSigningKeySchema)
        .then(newSigningKey)
        .then(console.log)
        .catch((err) => console.error(err.message))
  });

program
    .command('sk:pw <signing-key-file>')
    .description('Change password of encrypted singing key')
    .action((signingKeyFile) => {
        prompt(changePasswordSigningKeySchema)
            .then((answers) => {
                return signingKeyChangePW(answers, signingKeyFile)
            })
            .then(console.log)
            .catch((err) => console.error(err.message))
    });

program
  .command('dapp:stream <signing-key-file>')
  .option('-d, --dev', 'Dev mode build')
  .description('Build a DApp to an installable bundle')
  .action((signingKeyFile, cmd) => {
    prompt(buildBundleFileSchema)
        .then((answers) => {
            return dappStreaming(answers, signingKeyFile, cmd.dev === true)
        })
        .then(console.log)
        .catch((err) => console.error(err.message))
  });

program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.help()
}
