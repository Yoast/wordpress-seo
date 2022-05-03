// See: https://github.com/gruntjs/grunt-contrib-compress for details.
module.exports = {
	artifact: {
		options: {
			archive: "artifact.zip",
			level: 9,
		},
		files: [
			{
				expand: true,
				cwd: "artifact/",
				src: [ "**" ],
				dest: "<%= pluginSlug %>",
			},
		],
	},
};
