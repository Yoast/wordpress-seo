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
			src: "css/**/*",
			dest: "dist/",
		}, {
			src: "index.js",
			dest: "dist/",
		}, {
			src: "package.json",
			dest: "dist/",
		}, {
			src: ".babelrc",
			dest: "dist/",
		}, {
			src: "SEO ASSESSORS.md",
			dest: "dist/",
		}, {
			src: "CHANGELOG.md",
			dest: "dist/",
		}, {
			src: "LICENSE",
			dest: "dist/",
		}, {
			src: "src/config/syllables/**/*.json",
			dest: "dist/",
		} ],
	},
};
