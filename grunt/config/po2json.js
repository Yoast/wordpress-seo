// https://github.com/rockykitamura/grunt-po2json
module.exports = {
	all: {
		options: {
			format: 'jed1.x',
			domain: 'wordpress-seo'
		},
		src: ['languages/*.po'],
		dest: 'languages'
	},
	js: {
		options: {
			format: 'jed1.x',
			domain: 'wordpress-seo'
		},
		src: ['node_modules/yoastseo/languages/yoast-seo.pot'],
		dest: 'languages'
	}
};
