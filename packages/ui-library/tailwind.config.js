/* eslint-disable global-require */
module.exports = {
	presets: [ require( "@yoast/tailwindcss-preset" ) ],
	content: [ "./src/**/*.js" ],
	theme: {
		extend: {
		  ringWidth: {
				3: "3px",
		  },
		},
	  },
};
