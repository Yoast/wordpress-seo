module.exports = {
	build: {
		files: {
			"dist/yoast-seo.js": [ "dist/yoast-seo-pre-browserify.js" ]
		},
		options: {
			alias: {
				templates: "./js/templates.js"
			},
			plugin: [
				[
					'remapify', [
						{
							src: "**/*.js",
							expose: "analyses",
							cwd: "./js/analyses"
						},
						{
							src: "**/*.js",
							expose: "config",
							cwd: "./js/config"
						},
						{
							src: "**/*.js",
							expose: "stringProcessing",
							cwd: "./js/stringProcessing"
						}
					]
				]
			]
		}
	}
};
