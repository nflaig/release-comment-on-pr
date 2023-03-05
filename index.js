const core = require("@actions/core");
const { GitHub, context } = require("@actions/github");
const axios = require("axios");
const parse = require("issue-parser").parse;

async function run() {
  try {
    const accessToken = core.getInput("access-token");
    const octokit = new GitHub(accessToken);
    const { owner, repo } = context.repo;

    // Get the latest release
    const { data: release } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);

    // Parse the release notes to extract the pull request numbers
    const issues = parse(release.body).issues;

    // Post a comment on each pull request
    for (const issue of issues) {
      if (issue.prefix === "pull") {
        const prNumber = parseInt(issue.issue);
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: prNumber,
          body: `:tada: This pull request was included in [${release.name}](${release.html_url}) :tada:`,
        });
      }
    }

    console.log("Commented on pull requests included in release.");
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}

run();
