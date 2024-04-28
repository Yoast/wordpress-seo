module.exports = {
	preset: "@yoast/jest-preset",
	setupFilesAfterEnv: [ "<rootDir>/tests/setupTests.js" ],
	testPathIgnorePatterns: [
		"/tests/__mocks__/",
		"/tests/containers/mockSelectors.js",
		"/tests/helpers/factory.js",
		"/tests/setupTests.js",
		"/tests/decorator/__mocks__/@wordpress/rich-text/index.js",
		"/tests/test-utils.js",
	],
	testEnvironment: "jsdom",
	testEnvironmentOptions: {
		url: "http://localhost",
	},
	moduleNameMapper: {
		"\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/tests/__mocks__/fileMock.js",
		"\\.(svg)$": "<rootDir>/tests/__mocks__/svgMock.js",
		"\\.(css|less)$": "<rootDir>/tests/__mocks__/styleMock.js",
		"@wordpress/i18n": [
			"<rootDir>node_modules/@wordpress/i18n",
			"<rootDir>/../../node_modules/@wordpress/i18n",
		],
	},
	collectCoverageFrom: [
		"src/**/*.{js,jsx,ts,tsx}",
	],
	coverageReporters: [
		"json",
		"lcov",
		"text",
		"clover",
		"text-summary",
	],
};
