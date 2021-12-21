/* eslint-disable max-len */
// Custom task
module.exports = {
	"wordpress-seo": {
		options: {
			pluginSlug: "wordpress-seo",
			addTheseChangeLogs: [
				[ "packages/schema-blocks/CHANGELOG.md", ".tmp/pg-schema-blocks.md" ],
				[ "packages/replacement-variable-editor/CHANGELOG.md", ".tmp/pg-replacement-variable-editor.md" ],
				[ "packages/analysis-report/CHANGELOG.MD", ".tmp/pg-analysis-report.md" ],
				[ "packages/browserslist-config/CHANGELOG.md", ".tmp/pg-browserslist-config.md" ],
				[ "packages/search-metadata-previews/CHANGELOG.md", ".tmp/pg-search-metadata-previews.md" ],
				[ "packages/components/CHANGELOG.MD", ".tmp/pg-components.md" ],
				[ "packages/social-metadata-forms/CHANGELOG.MD", ".tmp/pg-social-metadata-forms.md" ],
				[ "packages/social-metadata-previews/CHANGELOG.md", ".tmp/pg-social-metadata-previews.md" ],
				[ "packages/e2e-tests/CHANGELOG.md", ".tmp/pg-e2e-tests.md" ],
				[ "packages/style-guide/CHANGELOG.md", ".tmp/pg-style-guide.md" ],
				[ "packages/eslint/CHANGELOG.md", ".tmp/pg-eslint.md" ],
				[ "packages/yoast-components/CHANGELOG.MD", ".tmp/pg-yoast-components.md" ],
				[ "packages/feature-flag/CHANGELOG.md", ".tmp/pg-feature-flag.md" ],
				[ "packages/yoast-social-previews/CHANGELOG.md", ".tmp/pg-yoast-social-previews.md" ],
				[ "packages/helpers/CHANGELOG.md", ".tmp/pg-helpers.md" ],
				[ "packages/yoastseo/CHANGELOG.md", ".tmp/pg-yoastseo.md" ],
			],
			commitChangelog: true,
		},
	},
};


