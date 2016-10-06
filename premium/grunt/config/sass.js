// https://github.com/sindresorhus/grunt-sass
"use strict";

module.exports = {
	build: {
		files: {
			"<%= paths.css %>premium-metabox-331.css": [ "assets/css/src/metabox.scss" ],
			"<%= paths.css %>premium-redirects-340.css": [ "assets/css/src/redirects.scss" ],
			"<%= paths.css %>premium-social-preview-340.css": [ "assets/css/src/social-preview.scss" ],
		},
	},
};
