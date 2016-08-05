// See https://github.com/gruntjs/grunt-contrib-clean
module.exports = {
	"build": [ "js/dist/*.min.js", "!<%= paths.js %>/dist/yoast-seo-content-analysis.min.js" ],
};
