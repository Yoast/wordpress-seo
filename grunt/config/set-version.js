// Custom task
module.exports = {
	packageJSON: {
		options: {
			base: "yoast",
			target: "pluginVersion",
		},
		src: "package.json",
	},
	recalibration: {
		options: {
			base: "yoast",
			target: "recalibrationVersion",
		},
		src: "package.json",
	},
};
