const GitHubHandleExtractor = require("./GitHubHandleExtractor");
const Onboarder = require("../Onboarder");

class GitHubIssueOnboarderRepository {
  constructor(octokit) {
    this.octokit = octokit;
  }

  async findAll() {
    const issues = await this.octokit.paginate(
      this.octokit.rest.issues.listForRepo,
      {
        owner: "department-of-veterans-affairs",
        repo: "va.gov-team",
        labels: "platform-orientation",
        state: "all",
      },
    );

    return issues
      .filter(({ title }) => title.includes("Platform Orientation Template"))
      .map(({ body, user: { login }, created_at }) => {
        const gitHubHandleExtractor = new GitHubHandleExtractor();
        const gitHubHandle = gitHubHandleExtractor.extract(body, login);
        const onboardingStart = new Date(created_at);
        return new Onboarder({ gitHubHandle, onboardingStart });
      });
  }
}

module.exports = GitHubIssueOnboarderRepository;
