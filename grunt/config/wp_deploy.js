// See: https://github.com/stephenharris/grunt-wp-deploy for details.
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
			tmp_dir: "<%= paths.svnCheckoutDir %>",
		},
	},
	master: {
		options: {
			plugin_slug: "<%= pluginSlug %>",
			build_dir: "artifact",
			plugin_main_file: "<%= pluginMainFile %>",
			deploy_trunk: true,
			deploy_tag: true,
			assets_dir: "svn-assets",
			max_buffer: 10000 * 1024,
			tmp_dir: "<%= paths.svnCheckoutDir %>",
		},
	},
};
