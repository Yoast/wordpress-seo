// TODO: Move this to Tailwind preset package.
const theme = require( "./src/theme" );

module.exports = {
	content: [ "./src/**/*.js" ],
	theme: {
		extend: {
			fontSizes: theme.fontSizes,
			colors: theme.colors
		},
	},
	plugins: [],
	prefix: "yst-",
};
