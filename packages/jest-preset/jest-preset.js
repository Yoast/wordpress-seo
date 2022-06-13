module.exports = {
	moduleNameMapper: {
		"\\.(scss|css)$": require.resolve(
			"@wordpress/jest-preset-default/scripts/style-mock.js"
		),
	},
	modulePaths: [ "<rootDir>" ],
	setupFiles: [
		require.resolve(
			"@wordpress/jest-preset-default/scripts/setup-globals.js"
		),
	],
	testMatch: [
		"**/__tests__/**/*.[jt]s",
		"**/tests/**/*.[jt]s",
		"**/test/*.[jt]s",
		"**/?(*.)test.[jt]s",
	],
	transformIgnorePatterns: [ "/node_modules/(?!@yoast|yoastseo|lodash-es).+\\.js$" ],
	testEnvironment: "jsdom",
	testPathIgnorePatterns: [ "<rootDir>/node_modules/", "<rootDir>/vendor/" ],
	timers: "fake",
	transform: {
		"^.+\\.[jt]sx?$": require.resolve( "babel-jest" ),
	},
};
