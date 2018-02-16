// Custom task
module.exports = {
	options: {
		version: "<%= pluginVersion %>",
	},
	readme: {
		options: {
			regEx: /(Stable tag: )(\d+(\.\d+){0,3})([^\n^\.\d]?.*?)(\n)/,
			preVersionMatch: "$1",
			postVersionMatch: "$5",
		},
		src: "../readme.txt",
	},
	pluginFile: {
		options: {
			regEx: /(\* Version:\s+)(\d+(\.\d+){0,3})([^\n^\.\d]?.*?)(\n)/,
			preVersionMatch: "$1",
			postVersionMatch: "$5",
		},
		src: "../wp-seo-premium.php",
	},
	initializer: {
		options: {
			regEx: /(define\( \'WPSEO_VERSION\'\, \')(\d+(\.\d+){0,3})([^\.^\'\d]?.*?)(\' \);\n)/,
			preVersionMatch: "$1",
			postVersionMatch: "$5",
		},
		src: "../wp-seo-main.php",
	},
	premiumClass: {
		options: {
			regEx: /(\n\s+const PLUGIN_VERSION_NAME = \')(\d+(\.\d+){0,3})([^\.^\'\d]?.*?)(\';\n)/,
			preVersionMatch: "$1",
			postVersionMatch: "$5",
		},
		src: "premium.php",
	},
};
