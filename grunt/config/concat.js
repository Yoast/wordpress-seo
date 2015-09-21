module.exports = {
	options: {
		separator: ";",
		process: function(src, filepath) {
			if ( filepath === "node_modules/jed/jed.js" ) {
				return "(function() {var this = {};" + src + "window.YoastI18n = this.Jed;}())";
			}
			return src;
		}
	},
	dist: {
		src: [ "<%= paths.js %>/*.js", "node_modules/jed/jed.js", "<%= paths.js %>/config/*.js" ],
		dest: "dist/yoast-seo-content-analysis.min.js"
	}
};
