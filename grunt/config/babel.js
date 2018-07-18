module.exports = {
	publish: {
		files: [ {
			expand: true,
			src: "js/**/*.js",
			dest: "dist/",
		} ],
		options: {
			sourceMap: true,
			comments: true,
		},
	},
};
