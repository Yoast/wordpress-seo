module.exports = {
	// Only search for tests and source files in these folders.
	roots: [
		"<rootDir>/tests",
		"<rootDir>/src",
	],
	testRegex: ".*\\.test\\.(ts|tsx)$",
	testURL: "http://localhost",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
		"^.+\\.tsx?$": "ts-jest",
		"^.+\\.jsx?$": "babel-jest",
	},
};
