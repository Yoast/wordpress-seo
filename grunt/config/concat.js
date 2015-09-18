module.exports = {
	options: {
		separator: ";",
		process: function(src, filepath) {
			if ( filepath === "node_modules/jed/jed.js" ) {
				return "(function() {" + src + "window.YoastI18n = Jed;}())";
			}
			return src;
		}
	},
	dist: {
		src: [ "<%= paths.js %>/*.js", "node_modules/jed/jed.js", "<%= paths.js %>/config/*.js" ],
		dest: "dist/yoast-seo-content-analysis.min.js"
	}
};
