// https://github.com/sindresorhus/grunt-sass
"use strict";

module.exports = {
	build: {
		files: {
			"<%= paths.css %>premium-metabox-<%= pluginVersionSlug %>.css": [ "assets/css/src/metabox.scss" ],
			"<%= paths.css %>premium-redirects-<%= pluginVersionSlug %>.css": [ "assets/css/src/redirects.scss" ],
			"<%= paths.css %>premium-social-preview-<%= pluginVersionSlug %>.css": [ "assets/css/src/social-preview.scss" ],
		},
	},
};
