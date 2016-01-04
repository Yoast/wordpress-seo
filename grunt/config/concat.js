module.exports = {
	dist: {
		src: [ "<%= paths.js %>/*.js", "<%= paths.js %>/config/*.js", "!js/snippetPreview.js" ],
		dest: "dist/yoast-seo-pre-browserify.js"
	}
};
