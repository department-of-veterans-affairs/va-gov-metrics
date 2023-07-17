export default class GitHubHandleExtractor {
  NO_MATCH = -1;

  extract(body, submitter) {
    const gitHubHandleBeginRegex = /GitHub handle\*?:.*/;
    const gitHubHandleEndRegex = /\n/;

    const gitHubHandleBeginIndex = body.search(gitHubHandleBeginRegex);
    if (gitHubHandleBeginIndex === this.NO_MATCH) {
      return submitter;
    }

    const gitHubHandleEndIndex = body
      .substring(gitHubHandleBeginIndex)
      .search(gitHubHandleEndRegex);
    if (gitHubHandleEndIndex === this.NO_MATCH) {
      return submitter;
    }

    let gitHubHandle = body
      .substring(gitHubHandleBeginIndex)
      .substring(0, gitHubHandleEndIndex)
      .split(":")[1]
      .trim();

    if (!gitHubHandle) {
      return submitter;
    }
    // GitHub handle is a link like '[my-github-handle](https'
    if (gitHubHandle.startsWith("[")) {
      gitHubHandle = gitHubHandle.split("[")[1].split("]")[0];
    }
    if (gitHubHandle.startsWith("@")) {
      gitHubHandle = gitHubHandle.substring(1);
    }

    return gitHubHandle;
  }
}
