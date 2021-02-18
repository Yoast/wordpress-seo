// Custom task
module.exports = {
	options: {
		version: "<%= pluginVersion %>",
		useEditDistanceComapair: true,
	},
	default: {
		options: {
			readmePath: "readme.txt",
		},
	},
};
