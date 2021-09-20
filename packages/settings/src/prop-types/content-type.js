import PropTypes from "prop-types";

const options = PropTypes.shape( {
	slug: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	hasSinglePage: PropTypes.bool,
	hasArchive: PropTypes.bool,
	hasBreadcrumbs: PropTypes.bool,
	hasCustomFields: PropTypes.bool,
	hasSchemaPageTypes: PropTypes.bool,
	hasSchemaArticleTypes: PropTypes.bool,
	hasAutomaticSchemaTypes: PropTypes.bool,
	singleSupportedVariables: PropTypes.arrayOf( PropTypes.string ),
	archiveSupportedVariables: PropTypes.arrayOf( PropTypes.string ),
	defaults: PropTypes.shape( {
		schema: PropTypes.shape( {
			pageType: PropTypes.string,
			articleType: PropTypes.string,
		} ),
		templates: PropTypes.shape( {
			seo: PropTypes.shape( {
				singleTitle: PropTypes.string,
				singleDescription: PropTypes.string,
				archiveTitle: PropTypes.string,
				archiveDescription: PropTypes.string,
			} ),
			social: PropTypes.shape( {
				singleTitle: PropTypes.string,
				singleDescription: PropTypes.string,
				singleImage: PropTypes.string,
				archiveTitle: PropTypes.string,
				archiveDescription: PropTypes.string,
				archiveImage: PropTypes.string,
			} ),
		} ),
	} ),
} );

export default {
	options,
};
