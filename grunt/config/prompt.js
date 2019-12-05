// See https://github.com/dylang/grunt-prompt
module.exports = {
	monorepoVersions: {
		options: {
			questions: [
				{
					config: "config.monorepoVersions",
					type: "confirm",
					message: "Are those versions correct?",
				},
			],
		},
	},
};
