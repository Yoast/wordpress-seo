// Custom task
module.exports = {
	rc: {
		slackToken: process.env.SLACK_TEST_CHANNEL_TOKEN,
		message: "<!subteam^S01CRBFCFAS> <!subteam^S01FHUB56RK> <!subteam^S4A41PJ0H> A Free RC has been created: ",
	},
	beta: {
		slackToken: process.env.SLACK_BETA_CHANNEL_TOKEN,
		message: "<!channel> A Free beta has been created: ",
	},
};
