const github = require('@actions/github');
const core = require('@actions/core');

const hasChanged = require('./hasChanged');

async function run() {
  try {
    const context = github.context;
    const lastCommit = context.eventName == "push" ? context.payload.before : 'HEAD~1';
    core.info(`lastCommit:${lastCommit}\neventName:${context.eventName}\nbefore:${context.payload.before}\npayload:${context.payload}`);

    const paths = core.getInput('paths', { required: true });
    const changed = await hasChanged(paths, lastCommit);

    if (changed) {
      core.info(`Code in the following paths changed: ${paths}`);
    } else {
      core.info(`Code in the following paths hasn't changed: ${paths}`);
    }

    core.setOutput('changed', changed);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
