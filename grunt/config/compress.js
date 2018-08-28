module.exports = {
	artifact: {
		options: {
			archive: "artifact.zip",
			level: 9,
		},
		files: [
			{
				cwd: "artifact/",
				src: [ "**" ],
				dest: "wordpress-seo",
			},
		],
	},
};
