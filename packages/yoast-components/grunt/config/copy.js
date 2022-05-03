// See https://github.com/gruntjs/grunt-contrib-copy
module.exports = {
	css: {
		files: [
			{
				src: "css-dist/all.css",
				dest: "css-dist/yoast-components.min.css",
			},
			{
				src: "css-dist/standalone.css",
				dest: "css-dist/yoast-components-standalone.min.css",
			},
		],
	},
	publish: {
		files: [
			{
				src: [
					".babelrc",
					"**/*",
					"!dist/**/*",
					"!node_modules/**/*",
				],
				dest: "dist/",
			},
		],
	},
};
