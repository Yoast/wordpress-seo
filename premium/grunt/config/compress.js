module.exports = {
	artifact: {
		options: {
			archive: "../artifact.zip",
		},
		files: [
			{
				expand: true,
				cwd: "../artifact",
				src: [ "**" ],
				dest: "wordpress-seo-premium",
			},
		],
	},
};
