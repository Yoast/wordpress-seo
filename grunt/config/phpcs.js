// https://github.com/SaschaGalley/grunt-phpcs
module.exports = {
	options: {
		ignoreExitCode: true
	},
	plugin: {
		options: {
			standard: 'ruleset.xml',
			reportFile: '<%= paths.logs %>phpcs.log',
			extensions: 'php'
		},
		dir: [
			'<%= files.php %>',
			'!admin/license-manager/**'
		]
	}
};
