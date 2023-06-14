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
	publish: {
		files: [ {
			src: "index.js",
			dest: "dist/",
		}, {
			src: "package.json",
			dest: "dist/",
		}, {
			src: "babel.config.js",
			dest: "dist/",
		}, {
			src: "README.md",
			dest: "dist/",
		}, {
			src: "CHANGELOG.md",
			dest: "dist/",
		}, {
			src: "LICENSE",
			dest: "dist/",
		} ],
	},
};
