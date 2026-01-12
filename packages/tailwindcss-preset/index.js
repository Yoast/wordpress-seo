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
				woo: {
					dark: "#0e1e65",
					light: "#0075B3"
				},
			},
			strokeWidth: {
				3: "3px",
			},
			maxWidth: {
				page: "2048px",
			},
			backgroundImage: {
				"ai-100": "linear-gradient(97.38deg, #FAF3F7 0%, #EEF2FF 100%)",
				"ai-300": "linear-gradient(to bottom right, #cd82ab, #a5b4fc)",
				"ai-500": "linear-gradient(97.38deg, #A61E69 0%, #6366F1 100%)",
				"ai-600": "linear-gradient(97.38deg, #8F0F57 0%, #4338CA 100%)",
				"gradient-content-optimization": "linear-gradient( 135deg, #f6a13a 12%, #2b36db 60% )",
				"gradient-technical-seo": "linear-gradient( 135deg, #b44bb8 28%, #f39ac7 53%, #f6a13a 100% )",
				"gradient-social-sharing": "linear-gradient( 135deg, #3a3ed6 0%, #6a3fae 28%, #b44b9a 52%, #e06aa8 72%, #ffb6e6 100% )",
				"gradient-site-structure": "linear-gradient(135deg, #5fd4b5 0%, #4a4fd6 72%, #1f2a6d 100%)",
				"gradient-tools": "linear-gradient( 135deg, #1b0f6b 0%, #173c7a 28%, #1f6f82 55%, #2f9a8f 78%, #44b3a3 100%)",
			}
		},
	},
	important: true,
	plugins: [
		require( "@tailwindcss/container-queries" ),
		require( "@tailwindcss/forms" )( {
			strategy: "class",
		} ),
		function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--yst-ai-color-purple-300': '#a5b4fc',
          '--yst-ai-color-pink-300': '#cd82ab',
        },
      });
    },
	],
	corePlugins: {
		preflight: false,
	},
	content: [ "./node_modules/@yoast/ui-library/**/*.js" ],
};
