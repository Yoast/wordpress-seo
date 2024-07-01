// See https://github.com/gruntjs/grunt-contrib-copy
module.exports = {
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
					"blocks/**",
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
					"!**/README.md",
				],
				dest: "<%= files.artifact %>",
			},
		],
	},
};
