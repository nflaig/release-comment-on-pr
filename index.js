const core = require("@actions/core");
const github = require("@actions/github");
const issueParser = require("issue-parser");
const parse = issueParser("github");
const { template } = require("lodash");

async function run() {
  try {
    const token = core.getInput("token");
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;

    // Get the message template from the user input
    const messageTemplate =
      core.getInput("message", { required: false }) ||
      ":tada: This PR is included in [${releaseTag}](${releaseUrl}) :tada:";

    const { data: release } = await octokit.rest.repos.getRelease({ owner, repo, release_id: "latest" });

    // Parse the release notes to extract the pull request numbers
    const prNumbers = parse(release.body).refs.map((ref) => ref.issue);

    // Used to print out PR URLs
    const pullRequestUrls = [];

    // Post a comment on each pull request
    for (const prNumberStr of prNumbers) {
      const prNumber = parseInt(prNumberStr);
      const { data: pullRequest } = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: prNumber,
      });
      const message = template(messageTemplate)({
        releaseName: release.name,
        releaseTag: release.tag_name,
        releaseUrl: release.html_url,
        pullRequestTitle: pullRequest.title,
        pullRequestUrl: pullRequest.html_url,
        pullRequestNumber: prNumber,
      });
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: message,
      });
      pullRequestUrls.push(pullRequest.html_url);
    }

    console.log("Commented on pull requests included in release:");
    pullRequestUrls.forEach((url) => console.log(url));
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}

run();
