module.exports = {
	all: {
		options: {
			textdomain: '<%= pkg.plugin.textdomain %>',
			baseFile: 'languages/yoast-social-previews.json'
		},
		src: [ 'languages/wordpress-seo-*.json' ]
	}
};
