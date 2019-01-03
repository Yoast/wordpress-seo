// https://github.com/SaschaGalley/grunt-phpcs
module.exports = {
	options: {
		ignoreExitCode: true,
	},
	plugin: {
		options: {
			bin: "vendor/bin/phpcs",
			standard: "phpcs.xml.dist",
			extensions: "php",
		},
		dir: [
			"<%= files.php %>",
			"!admin/license-manager/**",
			"!admin/i18n-module/**",
		],
	},
};
