module.exports = {
	options: {
		separator: ";",
		process: function( src, filepath ) {
			"use strict";
			if ( filepath === "node_modules/jed/jed.js" ) {
				return "YoastSEO = ( 'undefined' === typeof YoastSEO ) ? {} : YoastSEO;(function() {" + src + "}.call(YoastSEO))";
			}
			return src;
		}
	},
	dist: {
		src: [ "<%= paths.js %>/*.js", "node_modules/jed/jed.js", "<%= paths.js %>/config/*.js" ],
		dest: "dist/yoast-seo-content-analysis.min.js"
	}
};
