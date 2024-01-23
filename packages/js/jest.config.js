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
	// https://testing-library.com/docs/react-testing-library/setup#jest-27
	testEnvironment: "jest-environment-jsdom",
	moduleNameMapper: {
		"\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/tests/__mocks__/fileMock.js",
		"\\.(svg)$": "<rootDir>/tests/__mocks__/svgMock.js",
		"\\.(css|less)$": "<rootDir>/tests/__mocks__/styleMock.js",
		"find-with-regex": "<rootDir>/node_modules/find-with-regex/lib/index.js",
		"^lodash-es$": "lodash",
		"^lodash-es/(.*)$": "lodash/$1",
		"@yoast/ui-library": "<rootDir>/../ui-library/src",
	},
	moduleDirectories: [
		"<rootDir>/node_modules",
		"<rootDir>/../../node_modules",
		"node_modules",
	],
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
	testURL: "http://localhost/",
};
