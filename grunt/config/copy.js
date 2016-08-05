module.exports = {
	css: {
		files: [ {
			expand: true,
			options: {
				noProcess: [ "**/*, png" ],
			},
			cwd: "<%= paths.css %>/images/",
			src:  "*.{png,svg}",
			dest: "dist/images",
		} ],
	},
};
