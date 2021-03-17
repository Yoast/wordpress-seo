// Custom task
module.exports = {
	rc: {
		slackToken: process.env.SLACK_TEST_CHANNEL_TOKEN,
		message: "<!subteam^S01CRBFCFAS> <!subteam^S01FHUB56RK> <!subteam^S4A41PJ0H> An RC has been created: ",
	},
	beta: {
		slackToken: process.env.SLACK_TEST_CHANNEL_TOKEN,
		message: "<!subteam^S01CRBFCFAS> <!subteam^S01FHUB56RK> <!subteam^S4A41PJ0H> A beta has been created: ",
	},
};
