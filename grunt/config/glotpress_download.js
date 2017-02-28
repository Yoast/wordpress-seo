// https://github.com/markoheijnen/grunt-glotpress
module.exports = {
	plugin: {
		options: {
			url: "<%= pkg.plugin.glotpress %>",
			domainPath: "<%= paths.languages %>",
			file_format: "%domainPath%/%textdomain%-%wp_locale%.%format%",
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
};
