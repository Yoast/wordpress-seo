// https://github.com/MohammadYounes/grunt-rtlcss
module.exports = {
	options: {
	    clean: true
	},
	plugin: {
		expand: true,
		cwd: "<%= paths.css %>",
		src: [
			"**/*.css",
			"!**/*.min.css",
		],
		dest: "css/dist",
		ext: "-rtl.css",
	},
};
