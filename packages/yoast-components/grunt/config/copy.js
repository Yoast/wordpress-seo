// See https://github.com/gruntjs/grunt-contrib-copy
module.exports = {
	publish: {
		files: [ {
			src: [
				"**/*",
				"!dist/**/*",
				"!node_modules/**/*"
			],
			dest: "dist/",
		} ],
	},
};
