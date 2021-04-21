const github = require('@actions/github');
const core = require('@actions/core');

const hasChanged = require('./hasChanged');

async function run() {
  try {
    const paths = core.getInput('paths', { required: true });
    
    const context = github.context;
    switch(context.eventName) {
      case "push":
        core.info(`Push detected.\n`);
        var lastCommit = context.payload.before;
        break;
      case "pull_request":
        core.info(`Pull request detected: ${context.payload}\n`);
        var lastCommit = context.payload.pullRequest.base.sha;
        break;
      default:
        core.info(`Other event type detected.\n`);
        var lastCommit = "HEAD~1";
        break;
    }
    
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
