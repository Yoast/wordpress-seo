module.exports = {
	preset: "@yoast/jest-preset",
	transform: {
		"^.+\\.[tj]sx?$": "babel-jest",
		"^.+\\.mdx?$": "@storybook/addon-docs/jest-transform-mdx",
	},
};
