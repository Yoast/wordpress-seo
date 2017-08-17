module.exports = {
	artifact: {
		options: {
			archive: "../artifact.zip",
		},
		files: [
			{
				cwd: "artifact/",
				serc: [ "**" ],
				dest: "wordpress-seo-premium",
			},
		],
	},
};
