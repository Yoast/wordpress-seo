// https://github.com/markoheijnen/grunt-glotpress
module.exports = {
	plugin: {
		options: {
			url        : '<%= pkg.plugin.glotpress %>',
			domainPath : '<%= paths.languages %>',
			file_format: "%domainPath%%textdomain%-%wp_locale%.%format%",
			slug       : '<%= pkg.plugin.slug %>',
			textdomain : '<%= pkg.plugin.textdomain %>',
			formats    : ['mo'],
			filter     : {
				translation_sets  : false,
				minimum_percentage: 50,
				waiting_strings   : false
			}
		}
	}
};
