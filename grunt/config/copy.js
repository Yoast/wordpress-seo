// See https://github.com/gruntjs/grunt-contrib-copy
module.exports = {
	dependencies: {
		files: [
			{
				expand: true,
				cwd: "node_modules/select2/dist/js/",
				src: [ "select2.min.js", "i18n/*", "!i18n/build.txt" ],
				dest: "js/dist/select2/",
			},
			{
				expand: true,
				cwd: "node_modules/select2/dist/css/",
				src: [ "select2.min.css" ],
				dest: "css/dist/select2",
			},
		],
	},
	artifact: {
		files: [
			{
				expand: true,
				cwd: ".",
				src: [
					"admin/**",
					"css/**",
					"!css/src/**",
					"deprecated/**",
					"frontend/**",
					"images/**",
					"inc/**",
					"js/dist/**",
					"languages/**",
					"vendor/**",
					"index.php",
					"readme.txt",
					"wp-seo.php",
					"wp-seo-main.php",
				],
				dest: "artifact",
			},
		],
	},
};
