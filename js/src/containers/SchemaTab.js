import { __, sprintf } from "@wordpress/i18n";
import { LocationConsumer } from "../components/contexts/location";
import SchemaTab from "../components/SchemaTab";

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
 * Function to get props based on the postType.
 *
 * @param {bool} isPost Whether it's a post or a page.
 *
 * @returns {object} Props for this postType.
 */
const getPostBasedProps = ( isPost ) => {
	if ( isPost ) {
		const { articleTypeOptions } = window.wpseoScriptData.metabox.schema;
		return {
			showArticleTypeInput: true,
			helpTextTitle: __( "Yoast SEO automatically describes your posts using schema.org", "wordpress-seo" ),
			helpTextDescription: __(
				"This helps search engines understand your website and your content. You can change some of your settings for this post below.",
				"wordpress-seo"
			),
			schemaArticleTypeChange: setArticleType,
			schemaArticleTypeSelected: getArticleType(),
			schemaArticleTypeOptions: getSchemaTypeOptions( articleTypeOptions, getDefaultArticleType(), window.wpseoAdminL10n.postTypeNamePlural ),
		};
	}

	return {
		showArticleTypeInput: false,
		helpTextTitle: __( "Yoast SEO automatically describes your pages using schema.org", "wordpress-seo" ),
		helpTextDescription: __(
			"This helps search engines understand your website and your content. You can change some of your settings for this page below.",
			"wordpress-seo"
		),
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
 * @returns {React.Component} The SchemaTab.
 */
const SchemaTabContainer = () => {
	const isPost = window.wpseoAdminL10n.postType !== "page";
	const { pageTypeOptions } = window.wpseoScriptData.metabox.schema;

	const baseProps = {
		articleTypeLabel: __( "Article type", "wordpress-seo" ),
		pageTypeLabel: __( "Page type", "wordpress-seo" ),
		schemaPageTypeChange: setPageType,
		schemaPageTypeSelected: getPageType(),
		postTypeName: window.wpseoAdminL10n.postTypeNamePlural,
		schemaPageTypeOptions: getSchemaTypeOptions( pageTypeOptions, getDefaultPageType(), window.wpseoAdminL10n.postTypeNamePlural ),
	};

	return (
		<LocationConsumer>
			{ location => {
				const props = {
					...baseProps,
					...getPostBasedProps( isPost ),
					...getLocationBasedProps( location ),
				};

				return (
					<SchemaTab
						{ ...props }
					/>
				);
			} }
		</LocationConsumer>
	);
};

export default SchemaTabContainer;
