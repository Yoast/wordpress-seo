// https://github.com/blazersix/grunt-wp-i18n
module.exports = {
	plugin: {
		options: {
			mainFile: '../wp-seo-premium.php',
			domainPath: '<%= paths.languages %>',
			potFilename: 'wordpress-seo-premium.pot',
			potHeaders: {
				poedit: true,
				'report-msgid-bugs-to': '<%= pkg.pot.reportmsgidbugsto %>',
				'language-team': '<%= pkg.pot.languageteam %>',
				'last-translator': '<%= pkg.pot.lasttranslator %>'
			},
			type: 'wp-plugin'
		}
	}
};
