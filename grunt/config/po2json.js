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
		src: ['bower_components/yoast-seo/languages/yoast-seo.pot'],
		dest: 'languages'
	}
};
