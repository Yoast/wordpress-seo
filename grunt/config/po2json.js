// See https://github.com/rockykitamura/grunt-po2json
module.exports = {
	options: {
		format: "jed1.x",
		domain: "wordpress-seo",
	},
	all: {
		src: [ "languages/*.po" ],
		dest: "languages",
	},
	yoastComponents: {
		src: [ "languages/*.po" ],
		dest: "languages",
		fileName: ( fileName ) => {
			return fileName.replace( "wordpress-seo", "yoast-components" );
		},
	},
	js: {
		src: [
			"<%= files.pot.yoastseojs %>",
			"<%= files.pot.yoastComponents %>",
		],
		dest: "languages",
	},
};
