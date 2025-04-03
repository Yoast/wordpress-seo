// https://github.com/MohammadYounes/grunt-rtlcss
module.exports = {
	build: {
		src: [
			"**/*.css",
			"!**/*-rtl.css",
			// Exclude UI library CSS files, as they are already RTL compatible.
			"!tailwind-*.css",
		],
	},
};
