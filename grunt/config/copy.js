// See https://github.com/gruntjs/grunt-contrib-copy

// Take the artifact src file path and remove the vendor folder
let composerFiles = function() {
	//let files = this.__esModule.exports.artifact.files;
	//console.log(files);
	//let index = files.indexOf( "vendor/**" );
	//files.splice( index, 1 )
	return this.__esModule.exports.artifact.files;
};
module.exports = {
	dependencies: {
		files: [
			{
				expand: true,
				cwd: "node_modules/select2/dist/js/",
				src: [ "select2.full.min.js", "i18n/*", "!i18n/build.txt" ],
				dest: "js/dist/select2/",
			},
			{
				expand: true,
				cwd: "node_modules/select2/dist/css/",
				src: [ "select2.min.css" ],
				dest: "css/dist/select2",
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
					"css/**/*.min.css",
					"css/main-sitemap.xsl",
					"deprecated/**",
					"frontend/**",
					"images/**",
					"inc/**",
					"js/dist/**/*.min.js",
					"js/dist/select2/i18n/*.js",
					"languages/**",
					"vendor/**",
					"index.php",
					"license.txt",
					"readme.txt",
					"wp-seo.php",
					"wp-seo-main.php",
					"wpml-config.xml",
					"!languages/wordpress-seo.pot",
					"!vendor/bin",
					"!vendor/composer/installed.json",
					"!vendor/composer/installers/**",
					"!vendor/yoast/i18n-module/LICENSE",
					"!vendor/yoast/license-manager/samples/**",
					"!vendor/yoast/license-manager/class-theme-*",
					"!**/composer.json",
					"!**/README.md",
				],
				dest: "artifact",
			},
		],
	},
	composer_artifact: {
		files: [
			{
				expand: true,
				cwd: ".",
				src: [
					"admin/**",
					"css/**/*.min.css",
					"css/main-sitemap.xsl",
					"deprecated/**",
					"frontend/**",
					"images/**",
					"inc/**",
					"js/dist/**/*.min.js",
					"js/dist/select2/i18n/*.js",
					"languages/**",
					"index.php",
					"license.txt",
					"readme.txt",
					"wp-seo*.php",
					"wpml-config.xml",
					"!languages/wordpress-seo.pot",
					"composer.lock",
					"composer.json",
					"!**/README.md",
				],
				dest: "artifact",
			},
		],
	}
};