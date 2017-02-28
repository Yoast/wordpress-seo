// https://github.com/markoheijnen/grunt-glotpress
module.exports = ( grunt ) => {
	let freePackage = grunt.file.readJSON( "../package.json" );
	const fileFormat = "%domainPath%/%textdomain%-%wp_locale%.%format%";

	return {
		plugin: {
			options: {
				url: "<%= pkg.plugin.glotpress %>",
				domainPath: "<%= paths.languages %>",
				file_format: fileFormat,
				slug: "<%= pkg.plugin.slug %>",
				textdomain: "<%= pkg.plugin.textdomain %>",
				formats: [ "mo", "po" ],
				filter: {
					translation_sets: false,
					minimum_percentage: 50,
					waiting_strings: false
				},
			},
		},
		freePhpTranslations: {
			options: {
				url: freePackage.plugin.glotpress,
				domainPath: "../languages/",
				file_format: fileFormat,
				slug: "wp-plugins/" + freePackage.plugin.textdomain + "/dev/",
				textdomain: freePackage.plugin.textdomain,
				formats: [ "mo" ],
				filter: {
					translation_sets: false,
					// Use the same percentage as WordPress
					minimum_percentage: 95,
					waiting_strings: false,
				},
			},
		},
	};
};
