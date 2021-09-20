module.exports = {
	preset: "@wordpress/jest-preset-default",
	transformIgnorePatterns: [ "/node_modules/(?!@yoast|lodash-es).+\\.js$" ],
	setupFilesAfterEnv: [ "<rootDir>/jest-setup.js" ],
};
