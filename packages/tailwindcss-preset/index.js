/* eslint-disable global-require */
module.exports = {
	prefix: "yst-",
	theme: {
		fontSize: {
			xxs: "0.675rem",
			xs: ".75rem",
			sm: ".8125rem",
			tiny: ".875rem",
			base: "1rem",
			lg: "1.125rem",
			xl: "1.25rem",
			"2xl": "1.5rem",
			"3xl": "1.875rem",
			"4xl": "2.25rem",
			"5xl": "3rem",
			"6xl": "4rem",
			"7xl": "5rem",
		},
		extend: {
			colors: {
				primary: {
					50: "#faf3f7",
					100: "#f3e5ed",
					200: "#e0b3cc",
					300: "#cd82ab",
					400: "#b94986",
					500: "#a61e69",
					600: "#9a1660",
					700: "#8f0f57",
					800: "#83084e",
					900: "#770045",
				},
				analysis: {
					good: "#7ad03a",
					ok: "#ee7c1b",
					bad: "#dc3232",
					na: "#cbd5e1",
				},
			},
			strokeWidth: {
				3: "3px",
			},
		},
	},
	important: true,
	plugins: [
		require( "@tailwindcss/container-queries" ),
		require( "@tailwindcss/forms" )( {
			strategy: "class",
		} ),
	],
	corePlugins: {
		preflight: false,
	},
	content: [ "./node_modules/@yoast/ui-library/**/*.js" ],
};
