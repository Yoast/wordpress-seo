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
};
