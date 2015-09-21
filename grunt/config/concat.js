module.exports = {
	options: {
		separator: ";",
		process: function( src, filepath ) {
			"use strict";
			/**
			 * For the sake of convenience, we are shipping Jed as a hard dependency of YoastSEO.js.
			 * To keep the global scope clean, we are putting Jed on the YoastSEO object.
			 *
			 * How to namespace Jed:
			 *
			 * Jed assigns itself to the scope on which the closure in which Jed is defined is bound.
			 * In order to namespace Jed within YoastSEO, all we have to do is wrap it in a closure that is called with YoastSEO as its scope.
			 */
			if ( filepath === "node_modules/jed/jed.js" ) {
				return "YoastSEO = ( 'undefined' === typeof YoastSEO ) ? {} : YoastSEO;(function() {" + src + "}.call(YoastSEO))";
			}
			return src;
		}
	},
	dist: {
		src: [ "<%= paths.js %>/*.js", "node_modules/jed/jed.js", "<%= paths.js %>/config/*.js" ],
		dest: "dist/yoast-seo.js"
	}
};
