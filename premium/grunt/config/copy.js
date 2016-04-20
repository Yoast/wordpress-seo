// https://github.com/gruntjs/grunt-contrib-copy
module.exports = {
	css_social_previews: {
		files: [{
			expand: true,
			cwd: 'node_modules/yoast-social-previews/dist/',
			src: '*',
			dest: 'assets/dist/social_preview'
		}]
	}
};
