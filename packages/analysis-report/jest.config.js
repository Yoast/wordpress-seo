module.exports = {
	preset: "@yoast/jest-preset",
	setupFilesAfterEnv: [ "<rootDir>/tools/jest/setupTests.js" ],
	testMatch: [
		"**/tests/**/*Test.[jt]s",
	],
};
