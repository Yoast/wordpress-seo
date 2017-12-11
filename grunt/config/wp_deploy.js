// See: https://github.com/stephenharris/grunt-wp-deploy
/* eslint camelcase: 0 */
module.exports = {
	trunk: {
		options: {
			plugin_slug: "<%= pluginSlug %>",
			build_dir: "artifact",
			plugin_main_file: "<%= pluginMainFile %>",
			deploy_trunk: true,
			deploy_tag: false,
			// Equals about 10MB.
			max_buffer: 10000 * 1024,
		},
	},
	master: {
		options: {
			plugin_slug: "<%= pluginSlug %>",
			build_dir: "artifact",
			plugin_main_file: "<%= pluginMainFile %>",
			deploy_trunk: true,
			deploy_tag: true,
			max_buffer: 10000 * 1024,
		},
	},
};
