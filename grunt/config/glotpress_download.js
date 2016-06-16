// https://github.com/markoheijnen/grunt-glotpress
module.exports = {
	'yoastseo-js': {
		options: {
			url: '<%= pkg.plugin.glotpress %>',
			domainPath: '<%= paths.languages %>',
			file_format: '%domainPath%/%textdomain%-%wp_locale%.%format%',
			slug: 'yoastseo-js',
			textdomain: 'js-text-analysis',
			formats: [ 'mo', 'po' ],
			filter: {
				translation_sets: false,
				minimum_percentage: 50,
				waiting_strings: false
			}
		}
	}
};
