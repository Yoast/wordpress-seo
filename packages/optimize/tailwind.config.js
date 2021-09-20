const defaultConfig = require( "@yoast/admin-ui-toolkit/configs/tailwind.js" );
const forms = require( "@tailwindcss/forms" );

module.exports = {
	...defaultConfig,
	plugins: [ forms ],
	purge: {
		content: [
			"./src/**/**/*.js",
			"./src/*.js",
			"../../node_modules/\\@yoast/admin-ui-toolkit/**/*.js",
			"../../node_modules/\\@yoast/admin-ui-toolkit/**/**/*.js",
		],
	},
	theme: {
		...defaultConfig.theme,
		extend: {
			...defaultConfig.theme.extend,
			gridTemplateColumns: {
				media: "repeat(auto-fill,94px)",
			},
			gridTemplateRows: {
				media: "repeat(auto-fill,94px)",
			},
			height: {
				21: "21px",
				24: "24px",
				200: "196px",
				500: "500px",
			},
			maxHeight: {
				100: "94px",
			},
			width: {
				200: "196px",
			},
		},
	},
};
