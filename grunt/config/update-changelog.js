// Custom task
module.exports = {
	options: {
		version: "<%= pluginVersion %>",
		// RegEx: new RegExp( "(= " + function(version){console.log(version);return version;}(pluginVersion) + " =(\n.*)*?)(\n\n=)" ),
		matchGroupIndex: 1,
		readmePath: "readme.txt",
	},
};
