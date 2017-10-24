// See https://github.com/gruntjs/grunt-contrib-copy
module.exports = {
	css: {
		files: [ {
			expand: true,
			options: {
				noProcess: [ "**/*, png" ],
			},
			cwd: "<%= paths.css %>/images/",
			src: "*.{png,svg}",
			dest: "dist/images",
		} ],
	},
	js: {
		files: [
			{
				expand: true,
				cwd: "src/",
				src: "**/*.json",
				dest: "js",
			},
			{
				src: [ "src/templates.js" ],
				dest: "js/templates.js",
			},
		],
	},
};
