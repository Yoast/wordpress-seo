// https://github.com/blazersix/grunt-wp-i18n
module.exports = {
	options: {
		textdomain: '<%= pkg.plugin.textdomain %>',
		updateDomains: [ 'wordpress-seo' ]
	},
	plugin: {
		files: {
			src: [
				'<%= files.php %>'
			]
		}
	}
};
