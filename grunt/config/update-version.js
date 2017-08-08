// Custom task
module.exports = {
	options: {
		version: "<%= pluginVersion %>",
	},
	readme: {
		options: {
			regEx: /(Stable tag: )(\d\d?(\.\d\d?){0,3})([^\.\d]?.*?\n)/,
			preVersionMatch: "$1",
			postVersionMatch: "$4",
		},
		src: "readme.txt",
	},
	pluginFile: {
		options: {
			regEx: /(\* Version: )(\d\d?(\.\d\d?){0,3})([^\.\d]?.*?\n)/,
			preVersionMatch: "$1",
			postVersionMatch: "$4",
		},
		src: "wp-seo-premium.php",
	},
	initializer: {
		options: {
			regEx: /(define\( \'WPSEO_VERSION\'\, \')(\d\d?(\.\d\d?){0,3})(\'.*?\n)/,
			preVersionMatch: "$1",
			postVersionMatch: "$4",
		},
		src: "wp-seo-main.php",
	},
	premiumClass: {
		options: {
			regEx: /(const PLUGIN_VERSION_NAME = )(\')(\d\d?(\.\d\d?){0,3})(\'.*?\n)/,
			preVersionMatch: "$1$2",
			postVersionMatch: "$5",
		},
		src: "premium/class-premium.php",
	},
};
