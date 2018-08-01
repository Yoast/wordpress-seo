// https://github.com/rockykitamura/grunt-po2json
module.exports = {
	all: {
		options: {
			format: 'jed1.x',
			domain: 'wordpress-seo-premium'
		},
		src: ['languages/*.po'],
		dest: 'languages'
	},
	js: {
		options: {
			format: 'jed1.x',
			domain: 'wordpress-seo-premium'
		},
		src: ['languages/yoast-social-previews.pot'],
		dest: 'languages'
	}
};
