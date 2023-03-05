# GitHub Action: Comment on Pull Requests included in Release

This GitHub Action adds a comment to all pull requests that were included in a GitHub release. The comment includes a link to the release, along with a celebratory emoji.

## Usage

To use this action, you will need to provide your GitHub access token and the name of your repository.

```yaml
name: Comment on Pull Requests included in Release
on:
  release:
    types: [published]

jobs:
  comment:
    runs-on: ubuntu-latest
    steps:
      - name: Comment on Pull Requests
        uses: nflaig/release-comment-on-pr@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          # customize message
          message: ":tada: This pull request was included in [${releaseName}](${releaseUrl}) :tada:" 
```

Note that this action is triggered by the release.published event, which occurs when a new release is published in your repository.

## Inputs

This action has two required inputs:

- `token`: Your GitHub access token. You can use ${{ secrets.GITHUB_TOKEN }} to access the default token.
- `message`: The message to be included in the comment. This is passed to the action as a lodash template string.
  Available variables include: `releaseName`, `releaseUrl`, `pullRequestTitle`, `pullRequestUrl` and `pullRequestNumber`

## Outputs

This action does not have any outputs.

## Example

Here's an example of what the comment might look like:

:tada: This pull request was included in [v1.0.0](https://github.com/owner/repo/releases/tag/v1.0.0) :tada:

## Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos.  Packaging the action will create a packaged action in the dist folder.

Run prepare

```bash
npm run prepare
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

## Create a release branch

Users shouldn't consume the action from master since that would be latest code and actions can break compatibility between major versions.

Checkin to the v1 release branch

```bash
git checkout -b v1
git commit -a -m "v1 release"
```

```bash
git push origin v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Usage

You can now consume the action by referencing the v1 branch

```yaml
uses: actions/javascript-action@v1
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/javascript-action/actions) for runs of this action! :rocket:


## License

This GitHub Action is licensed under the [MIT License](LICENSE).
