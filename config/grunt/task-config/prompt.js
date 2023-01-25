const colors = require( "colors/safe" );

// See https://github.com/dylang/grunt-prompt
/**
 * Provides the settings for prompts within a Grunt task.
 */
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
			/**
			 * Handles the answer to the prompt. If false, will throw an error.
			 * @param {Object} results The result of the prompt.
			 *
			 * @returns {void}
			 */
			then: function( results ) {
				if ( results[ "config.monorepoVersions" ] === false ) {
					throw "The script has been aborted because the monorepo versions are incorrect." +
						  "\n" +
						  "Use --yoast-components-no-rc and --yoastseo-no-rc if you need to use the non-rc version of these packages." +
						  "\n\n" +
						  "Otherwise, ask team Lingo to release the monorepo packages.";
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
	slackMessageError: {
		options: {
			questions: [
				{
					config: "config.slackMessageError.promptInput",
					type: "input",
					message: colors.bgWhite( colors.inverse( colors.red(
						"There was an error trying to send a notification to the Yoast Slack. " +
						`${ colors.green( " For now, notify the appropriate channel yourself." ) } Press enter to continue...`
					) ) ),
				},
			],
		},
	},
};
