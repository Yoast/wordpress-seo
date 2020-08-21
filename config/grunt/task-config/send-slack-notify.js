// Custom task

module.exports =  {
	rc: {
		options:{
			slackToken: process.env.SLACK_DEV_PLUGIN_CHANNEL_TOKEN || process.env.SLACK_TEST_CHANNEL_TOKEN,
			message: "An RC has been created: <%= tagUrl %>" ,
			enable: true
		}
	},
	'add-git-issue-slack-message': {
		options:{
			slackToken: process.env.SLACK_DEV_PLUGIN_CHANNEL_TOKEN || process.env.SLACK_TEST_CHANNEL_TOKEN,
			message: "<%= slackMessage %>" ,
			enable: "<%= enableSlack %>",
		}
	},
};
