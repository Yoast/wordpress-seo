// Custom task
module.exports = {
	rc: {
		slackToken: process.env.SLACK_TEST_CHANNEL_TOKEN,
		message: "@plugin-testers @product-team An RC has been created: ",
	},
};
