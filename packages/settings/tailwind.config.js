const defaultConfig = require( "@yoast/admin-ui-toolkit/configs/tailwind.js" );
const forms = require( "@tailwindcss/forms" );

module.exports = {
	...defaultConfig,
	plugins: [ forms ],
	purge: {
		content: [
			"./src/**/*.js",
			"./src/*.js",
			"../../node_modules/\\@yoast/admin-ui-toolkit/**/*.js",
			"../../node_modules/\\@yoast/admin-ui-toolkit/**/**/*.js",
		],
	},
};
