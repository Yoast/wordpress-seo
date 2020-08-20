import { __, sprintf } from "@wordpress/i18n";
import { LocationConsumer } from "../components/contexts/location";
import SchemaTab from "../components/SchemaTab";
import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";

const articleTypeInputId = "yoast_wpseo_schema_article_type";
const pageTypeInputId = "yoast_wpseo_schema_page_type";

/**
 * Returns the schema type options with a default.
 *
 * @param {Object[]} schemaTypeOptions The schema type options.
 * @param {string} defaultType The default value to change the name for.
 * @param {string} postTypeName The plural name of the post type.
 *
 * @returns {Object[]} A copy of the schema type options.
 */
const getSchemaTypeOptions = ( schemaTypeOptions, defaultType, postTypeName ) => {
	return [
		{
			name: sprintf(
				/* translators: %1$s expands to the plural name of the current post type, %2$s expands to the current site wide default. */
				__( "Default for %1$s (%2$s)", "wordpress-seo" ),
				postTypeName,
				schemaTypeOptions.find( option => option.value === defaultType ).name,
			),
			value: "",
		},
		...schemaTypeOptions,
	];
};

/**
 * Gets the ArticleType hidden input.
 *
 * @returns {Object} The ArticleType input.
 */
const getArticleTypeInput = () => document.getElementById( articleTypeInputId );

/**
 * Gets the default ArticleType from the hidden input.
 *
 * @returns {string} The default ArticleType.
 */
const getDefaultArticleType = () => document.getElementById( articleTypeInputId ).getAttribute( "data-default" );

/**
 * Gets the ArticleType from the hidden input.
 *
 * @returns {string} The ArticleType.
 */
const getArticleType = () => document.getElementById( articleTypeInputId ).value;

/**
 * Sets the ArticleType on the hidden input.
 *
 * @param {string} articleType The selected ArticleType.
 *
 * @returns {void}
 */
const setArticleType = ( articleType ) => {
	document.getElementById( articleTypeInputId ).value = articleType;
};

/**
 * Gets the default PageType from the hidden input.
 *
 * @returns {string} The default PageType.
 */
const getDefaultPageType = () => document.getElementById( pageTypeInputId ).getAttribute( "data-default" );

/**
 * Gets the PageType from the hidden input.
 *
 * @returns {string} The PageType.
 */
const getPageType = () => document.getElementById( pageTypeInputId ).value;

/**
 * Sets the PageType on the hidden input.
 *
 * @param {string} pageType The selected PageType.
 *
 * @returns {void}
 */
const setPageType = ( pageType ) => {
	document.getElementById( pageTypeInputId ).value = pageType;
};

/**
 * Function to get the article props.
 *
 * @returns {object} The article props.
 */
const getArticleProps = () => {
	const { articleTypeOptions } = window.wpseoScriptData.metabox.schema;

	return {
		showArticleTypeInput: true,
		schemaArticleTypeChange: setArticleType,
		schemaArticleTypeSelected: getArticleType(),
		schemaArticleTypeOptions: getSchemaTypeOptions( articleTypeOptions, getDefaultArticleType(), window.wpseoAdminL10n.postTypeNamePlural ),
	};
};

/**
 * Function to get props based on the location.
 *
 * @param {string} location The location in which the component is rendered.
 *
 * @returns {object} Props for this location.
 */
const getLocationBasedProps = ( location ) => {
	if ( location === "metabox" ) {
		return {
			helpTextLink: "https://yoa.st/400",
			additionalHelpTextLink: "https://yoa.st/402",
			isMetabox: true,
		};
	}

	return {
		helpTextLink: "https://yoa.st/401",
		additionalHelpTextLink: "https://yoa.st/403",
		isMetabox: false,
	};
};

/**
 * Renders the SchemaComponent.
 *
 * @param {Object} props The props.
 *
 * @returns {React.Component} The SchemaTab.
 */
const SchemaTabContainer = ( props ) => {
	const isArticleAvailable = getArticleTypeInput() !== null;
	const { pageTypeOptions } = window.wpseoScriptData.metabox.schema;

	let baseProps = {
		articleTypeLabel: __( "Article type", "wordpress-seo" ),
		pageTypeLabel: __( "Page type", "wordpress-seo" ),
		schemaPageTypeChange: setPageType,
		schemaPageTypeSelected: getPageType(),
		postTypeName: window.wpseoAdminL10n.postTypeNamePlural,
		schemaPageTypeOptions: getSchemaTypeOptions( pageTypeOptions, getDefaultPageType(), window.wpseoAdminL10n.postTypeNamePlural ),
		showArticleTypeInput: false,
		helpTextTitle: __( "Yoast SEO automatically describes your pages using schema.org", "wordpress-seo" ),
		helpTextDescription: __(
			"This helps search engines understand your website and your content. You can change some of your settings for this page below.",
			"wordpress-seo"
		),
	};
	if ( isArticleAvailable ) {
		baseProps = {
			...baseProps,
			...getArticleProps(),
		};
	}

	return (
		<LocationConsumer>
			{ location => {
				const schemaTabProps = {
					...props,
					...baseProps,
					...getLocationBasedProps( location ),
				};

				return <SchemaTab { ...schemaTabProps } />;
			} }
		</LocationConsumer>
	);
};

export default compose( [
	withSelect( ( select ) => {
		const { getPreferences } = select( "yoast-seo/editor" );

		return { displayFooter: getPreferences().displaySchemaSettingsFooter };
	} ),
] )( SchemaTabContainer );
