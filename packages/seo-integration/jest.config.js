module.exports = {
	setupFilesAfterEnv: [
		"<rootDir>/tests/setupTests.js"
	],
	collectCoverage: true,
	collectCoverageFrom: [
		"./src/**/*.js"
	],
	coverageThreshold: {
		global: {
			branches: 3,
			functions: 1,
			lines: 5,
			statements: 4
		}
	},
	coveragePathIgnorePatterns: [
		"node_modules"
	],
	testURL: "http://localhost",
	transformIgnorePatterns: [
		"[/\\\\]node_modules[/\\\\](?!lodash-es|lodash|@yoast).+\\.js$"
	],
	snapshotSerializers: [
		"enzyme-to-json/serializer"
	]
};
