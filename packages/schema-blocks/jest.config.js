module.exports = {
	// Only search for tests and source files in these folders.
	roots: [
		"<rootDir>/tests",
		"<rootDir>/src",
	],
	setupFilesAfterEnv: [ "<rootDir>/tests/setupTests.ts" ],
	testRegex: ".*\\.test\\.ts$",
	testURL: "http://localhost",
	transform: {
		"^.+\\.(t|j)sx?$": [ "ts-jest", "babel-jest" ],
		"^.+\\.tsx?$": "ts-jest",
	},
};
