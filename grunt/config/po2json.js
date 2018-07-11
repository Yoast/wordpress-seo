// See https://github.com/rockykitamura/grunt-po2json
module.exports = {
	options: {
		format: "jed1.x",
		domain: "wordpress-seo",
	},
	js: {
		src: [
			"<%= files.pot.yoastseojs %>",
			"<%= files.pot.yoastComponents %>",
			"<%= files.pot.wordpressSeoJs %>",
		],
		dest: "languages",
	},
};
