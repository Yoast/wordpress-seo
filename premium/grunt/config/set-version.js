// Custom task
module.exports = {
	packageJSON: {
		options: {
			base: "yoast",
			target: "pluginVersion",
		},
		src: "package.json",
	},
	packageJSONFree: {
		options: {
			base: "yoast",
			target: "pluginVersion",
		},
		src: "../package.json",
	},
};
