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
};
