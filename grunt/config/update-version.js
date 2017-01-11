// Custom task
module.exports = {
	options: {
		version: "<%= pluginVersion %>"
	},
	readme: {
		options: {
			regEx: /(Stable tag: )(\d(\.\d)?(\.\d)?(\.\d)?)(.*\n)/
		},
		src: "readme.txt"
	},
	pluginFile: {
		options: {
			regEx: /(\* Version: )(\d(\.\d)?(\.\d)?(\.\d)?)(.*\n)/
		},
		src: "wp-seo.php"
	},
	initializer: {
		options: {
			regEx: /(define\( \'WPSEO_VERSION\'\, \')(\d(\.\d)?(\.\d)?(\.\d)?)(\' \)\;.*\n)/
		},
		src: "wp-seo-main.php"
	}
};
