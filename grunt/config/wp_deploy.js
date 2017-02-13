// See: https://github.com/stephenharris/grunt-wp-deploy
/* eslint camelcase: 0 */
module.exports = {
	trunk: {
		options: {
			plugin_slug: "wordpress-seo",
			build_dir: "artifact",
			plugin_main_file: "wp-seo.php",
			deploy_trunk: true,
			deploy_tag: false,
			max_buffer: 3000 * 1024, // Equals about 3MB
		},
	},
};
