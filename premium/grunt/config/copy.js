// https://github.com/gruntjs/grunt-contrib-copy
module.exports = {
	css_social_previews: {
		files: {
			'assets/dist/social_preview/twitter-placeholder.svg': [ 'node_modules/yoast-social-previews/dist/twitter-placeholder.svg' ],
			'assets/dist/social_preview/yoast-social-preview-350.min.css': [ 'node_modules/yoast-social-previews/dist/yoast-social-preview.min.css' ]
		}
	}
};
