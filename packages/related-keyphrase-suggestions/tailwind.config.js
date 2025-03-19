module.exports = {
	presets: [ require( "@yoast/tailwindcss-preset" ) ],
	content: [
		"../ui-library/src/**/!(stories).js",
		"./src/**/*.js",
		"./src/**/*.mdx",
		"./src/**/*.md",
	],
	theme: {
		extend: {
			animation: {
				"appear-disappear": "appearDisappear 1s ease-out forwards",
			},
			keyframes: {
				appearDisappear: {
					"0%": { opacity: "0" },
					"20%": { opacity: "1" },
					"70%": { opacity: "1" },
					"100%": { opacity: "0" },
				},
			},
		},
	},
};
