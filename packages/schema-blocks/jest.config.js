module.exports = {
	// Only search for tests and source files in these folders.
	roots: [
		"<rootDir>/tests",
		"<rootDir>/src",
	],
	testRegex: ".*\\.test\\.ts$",
	testURL: "http://localhost",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
		"^.+\\.jsx?$": "babel-jest",
	},
};
