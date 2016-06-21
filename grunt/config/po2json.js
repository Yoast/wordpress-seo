// https://github.com/rockykitamura/grunt-po2json
module.exports = {
	'yoastseo-js': {
		options: {
			format: 'jed1.x',
			domain: 'js-text-analysis'
		},
		src: ['languages/js-text-analysis-*.po'],
		dest: 'languages'
	}
};
