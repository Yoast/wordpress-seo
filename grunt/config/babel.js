module.exports = {
	publish: {
		files: [ {
			expand: true,
			src: "src/**/*.js",
			dest: "dist/",
		} ],
		options: {
			sourceMap: true,
			comments: true,
		},
	},
};
