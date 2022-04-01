module.exports = {
	preset: "@yoast/jest-preset",
	setupFilesAfterEnv: [ "<rootDir>/tests/setupTests.js" ],
	testPathIgnorePatterns: [
		"/tests/edit.test.js",
		"/tests/__mocks__/",
		"/tests/containers/mockSelectors.js",
		"/tests/helpers/factory.js",
		"/tests/setupTests.js",
		"/tests/decorator/__mocks__/@wordpress/rich-text/index.js",
	],

	moduleNameMapper: {
		"\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/tests/__mocks__/fileMock.js",
		"\\.(css|less)$": "<rootDir>/tests/__mocks__/styleMock.js",
		"find-with-regex": "<rootDir>/node_modules/find-with-regex/lib/index.js",
		"^lodash-es$": "lodash",
		"^lodash-es/(.*)$": "lodash/$1",
	},
	moduleDirectories: [
		"<rootDir>/node_modules",
		"node_modules",
	],
	snapshotSerializers: [
		"enzyme-to-json/serializer",
	],
	testURL: "http://localhost/",
};
