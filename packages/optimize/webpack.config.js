const CopyPlugin = require( "copy-webpack-plugin" );
const defaultConfig = require( "@yoast/admin-ui-toolkit/configs/webpack.js" );

module.exports = {
	...defaultConfig,
	plugins: [
		...defaultConfig.plugins,
		new CopyPlugin( {
			patterns: [
				{ from: "public/tinymce-optimize-ui-skins/skin.min.css", to: "./tinymce/skins/ui/optimize-ui/skin.min.css" },
				{ from: "public/tinymce-optimize-ui-skins/content.min.css", to: "./tinymce/skins/ui/optimize-ui/content.min.css" },
				{ from: "../../node_modules/tinymce/tinymce.min.js", to: "./tinymce/tinymce.min.js" },
				{ from: "../../node_modules/tinymce/themes/silver/theme.min.js", to: "./tinymce/themes/silver/theme.min.js" },
				{ from: "../../node_modules/tinymce/icons/default/icons.min.js", to: "./tinymce/icons/default/icons.min.js" },
				{ from: "../../node_modules/tinymce/skins/content/default/content.min.css", to: "./tinymce/skins/content/default/content.min.css" },
				{ from: "../../node_modules/tinymce/plugins/lists/plugin.min.js", to: "./tinymce/plugins/lists/plugin.min.js" },
				{ from: "../../node_modules/tinymce/plugins/link/plugin.min.js", to: "./tinymce/plugins/link/plugin.min.js" },
				{ from: "../../node_modules/tinymce/plugins/image/plugin.min.js", to: "./tinymce/plugins/image/plugin.min.js" },
			],
		} ),
	],
};
