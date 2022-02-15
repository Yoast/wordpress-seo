// See https://github.com/gruntjs/grunt-contrib-copy
module.exports = {
	"js-dependencies": {
		files: [
			{
				expand: true,
				cwd: "node_modules/select2/dist/js/",
				src: [ "select2.full.min.js", "i18n/*", "!i18n/build.txt" ],
				dest: "<%= paths.jsDist %>select2/",
			},
		],
	},
	"css-dependencies": {
		files: [
			{
				expand: true,
				cwd: "node_modules/select2/dist/css/",
				src: [ "select2.min.css" ],
				dest: "css/dist/select2",
			},
		],
	},
	"css-files": {
		files: [
			{
				expand: true,
				cwd: "css/src",
				src: [ "**.css" ],
				dest: "css/dist/",
				rename: ( dest, src ) => {
					return dest + src.replace( ".css", "-<%= pluginVersionSlug %>.css" );
				},
			},
		],
	},
	artifact: {
		files: [
			{
				expand: true,
				cwd: ".",
				src: [
					"admin/**",
					"css/dist/**/*.css",
					"css/main-sitemap.xsl",
					"deprecated/**",
					"frontend/**",
					"images/**",
					"packages/js/images/**",
					"inc/**",
					"<%= paths.jsDist %>/**/*.js",
					"languages/**",
					"src/**",
					"lib/**",
					"vendor/**",
					"vendor_prefixed/**/*.php",
					"index.php",
					"license.txt",
					"readme.txt",
					"wp-seo.php",
					"wp-seo-main.php",
					"wpml-config.xml",
					"!vendor/bin/**",
					"!vendor/composer/installed.json",
					"!vendor/composer/installers/**",
					"!vendor/yoast/i18n-module/LICENSE",
					"!vendor/yoast/license-manager/samples/**",
					"!vendor/yoast/license-manager/class-theme-*",
					"!**/composer.json",
					"!**/SEO ASSESSORS.md",
				],
				dest: "<%= files.artifact %>",
			},
		],
	},
};
