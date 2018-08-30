// https://github.com/markoheijnen/grunt-glotpress
module.exports = {
	plugin: {
		options: {
			url: "<%= pkg.plugin.glotpress %>",
			domainPath: "<%= paths.languages %>",
			file_format: "%domainPath%/%textdomain%-%wp_locale%%slugSuffix%.%format%",
			slug: "wp-plugins/<%= pkg.plugin.textdomain %>/dev/",
			textdomain: "<%= pkg.plugin.textdomain %>",
			formats: [ "po" ],
			filter: {
				translation_sets: false,
				minimum_percentage: 50,
				waiting_strings: false,
			},
		},
	},
	"plugin-json": {
		options: {
			url: "<%= pkg.plugin.glotpress %>",
			domainPath: "<%= paths.languages %>",
			file_format: "%domainPath%/%textdomain%-%wp_locale%%slugSuffix%.json",
			slug: "wp-plugins/<%= pkg.plugin.textdomain %>/dev/",
			textdomain: "<%= pkg.plugin.textdomain %>",
			formats: [ "jed1x" ],
			filter: "<%= glotpress_download.plugin.options.filter %>",
		},
	},
};
