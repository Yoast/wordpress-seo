// https://github.com/blazersix/grunt-wp-i18n
module.exports = {
	options: {
		textdomain: '<%= pkg.plugin.textdomain %>'
	},
	plugin: {
		files: {
			src: [
				'<%= files.php %>',
				'!admin/license-manager/**'
			]
		}
	}
};
