// Custom task
module.exports = {
	options: {
		textdomain: "wordpress-seo",
	},
	yoastComponents: {
		src: "<%= files.pot.yoastComponents %>",
		dest: "<%= files.pot.php.yoastComponents %>",
	},
	yoastseojs: {
		src: "<%= files.pot.yoastseojs %>",
		dest: "<%= files.pot.php.yoastseojs %>",
	},
	wordpressSeoJs: {
		src: "<%= files.pot.wordpressSeoJs %>",
		dest: "<%= files.pot.php.wordpressSeoJs %>",
	},
};
