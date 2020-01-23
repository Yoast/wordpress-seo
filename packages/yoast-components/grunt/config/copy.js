// See https://github.com/gruntjs/grunt-contrib-copy
module.exports = {
	publish: {
		files: [ {
			src: [
				".babelrc",
				"**/*",
				"!dist/**/*",
				"!node_modules/**/*",
			],
			dest: "dist/",
		} ],
	},
};
