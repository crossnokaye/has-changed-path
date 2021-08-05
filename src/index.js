const github = require('@actions/github');
const core = require('@actions/core');

const hasChanged = require('./hasChanged');

async function run() {
  try {
    const paths = core.getInput('paths', { required: true });
    
    const context = github.context;
    var lastCommit;
    switch(context.eventName) {
      case "push":
      case "pull_request":
        core.info(`Pull request detected.\n`);
        lastCommit = context.payload.before;
        break;
      default:
        core.info(`Other event type detected.\n`);
        lastCommit = "HEAD~1";
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
