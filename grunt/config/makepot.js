// https://github.com/blazersix/grunt-wp-i18n
module.exports = {
	plugin: {
		options: {
			type: 'wp-plugin',
			domainPath: '/languages',
			potFilename: 'wordpress-seo.pot',
			potHeaders: {
				poedit: true,
				'report-msgid-bugs-to': 'https://github.com/yoast/wordpress-seo',
				'language-team': 'Yoast Translate <translations@yoast.com>',
				'last-translator': 'Yoast Translate Team <translations@yoast.com>'
			}
		}
	}
};
