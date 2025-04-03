module.exports = {
	setupFilesAfterEnv: [ "<rootDir>/tests/setupTests.js" ],
	testPathIgnorePatterns: [
		"/tests/__mocks__/",
		"/tests/setupTests.js",
	],
	// https://testing-library.com/docs/react-testing-library/setup#jest-27
	testEnvironment: "jest-environment-jsdom",
	moduleNameMapper: {
		"\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/tests/__mocks__/fileMock.js",
		"\\.(svg)$": "<rootDir>/tests/__mocks__/svgMock.js",
		"\\.(css|less)$": "<rootDir>/tests/__mocks__/styleMock.js",
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
	transformIgnorePatterns: [
		"/node_modules/(?!memize|@wordpress/i18n).+\\.js$",
	],
	transform: {
		"^.+\\.[jt]sx?$": "babel-jest",
	},
};
