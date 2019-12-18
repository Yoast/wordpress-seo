const colors = require( "colors/safe" );

// See https://github.com/dylang/grunt-prompt
module.exports = {
	monorepoVersions: {
		options: {
			questions: [
				{
					config: "config.monorepoVersions",
					type: "confirm",
					message: "Are the above versions correct?",
				},
			],
			then: function( results ) {
				if ( results[ "config.monorepoVersions" ] === false ) {
					throw "The script has been aborted because the monorepo versions are incorrect. Ask team Lingo to release the monorepo packages.";
				}
			},
		},
	},
	slackEnvMissing: {
		options: {
			questions: [
				{
					config: "config.envMissing.promptInput",
					type: "input",
					message: colors.bgWhite( colors.inverse( colors.red(
						"Missing or incorrect .env variables. See .env.example for hints about the required values.\r\n" +
						`Not sending a notification to the Yoast Slack. ${
							colors.green( " For now, notify the appropriate channel yourself." )
						} Press enter to continue...`
					) ) ),
				},
			],
		},
	},
};
