// https://github.com/SaschaGalley/grunt-phpcs
module.exports = {
	options: {
		standard: 'codesniffer.xml',
		reportFile: 'phpcs.txt',
		ignoreExitCode: true
	},
	all: {
		dir: [
			'**/*.php',
			'!admin/license-manager/**',
			'!node_modules/**'
		]
	}
};
