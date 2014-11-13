// https://github.com/blazersix/grunt-wp-i18n
module.exports = {
	options: {
		textdomain: 'wordpress-seo'
	},
	php: {
		files: {
			src: [
				'*php',
				'**/*.php',
				'!admin/license-manager/**',
				'!node_modules/**'
			]
		}
	}
};
