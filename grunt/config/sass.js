//https://github.com/sindresorhus/grunt-sass
module.exports = {
	options: {
		outputStyle: "compressed"
	},
	build: {
		files: {
			"dist/yoast-seo.min.css": "css/analyzer.scss"
		}
	}
};
