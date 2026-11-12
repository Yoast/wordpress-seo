/* global wpseoAdminL10n */
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import SchemaTab from "../components/SchemaTab";
import SchemaFields from "../helpers/SchemaFields";
import withLocation from "../helpers/withLocation";

/**
 * Function to get props based on the location.
 *
 * @param {string} location The location in which the component is rendered.
 *
 * @returns {Object} Props for this location.
 */
const getLocationBasedProps = ( location ) => {
	if ( location === "metabox" ) {
		return {
			helpTextLink: wpseoAdminL10n[ "shortlinks.metabox.schema.explanation" ],
			additionalHelpTextLink: wpseoAdminL10n[ "shortlinks.metabox.schema.page_type" ],
			isMetabox: true,
		};
	}

	return {
		helpTextLink: wpseoAdminL10n[ "shortlinks.sidebar.schema.explanation" ],
		additionalHelpTextLink: wpseoAdminL10n[ "shortlinks.sidebar.schema.page_type" ],
		isMetabox: false,
	};
};

/**
 * Renders the SchemaComponent.
 *
 * @param {Object} props The props.
 * @param {boolean} props.displayFooter Whether to display the footer.
 * @param {string} props.schemaPageTypeSelected The selected page type.
 * @param {string} props.schemaArticleTypeSelected The selected article type.
 * @param {string} props.defaultArticleType The default article type.
 * @param {string} props.defaultPageType The default page type.
 * @param {Function} props.loadSchemaPageData Loads the schema page data.
 * @param {Function} props.loadSchemaArticleData Loads the schema article data.
 * @param {Function} props.schemaPageTypeChange Changes the selected page type.
 * @param {Function} props.schemaArticleTypeChange Changes the selected article type.
 * @param {string} props.location The location in which the component is rendered.
 *
 * @returns {JSX.Element} The SchemaTab.
 */
const SchemaTabContainer = ( props ) => {
	const showArticleTypeInput = SchemaFields.articleTypeInput !== null;

	useEffect( () => {
		props.loadSchemaPageData();
		if ( showArticleTypeInput ) {
			props.loadSchemaArticleData();
		}
	}, [] );

	const { pageTypeOptions, articleTypeOptions } = window.wpseoScriptData.metabox.schema;

	const baseProps = {
		articleTypeLabel: __( "Article type", "wordpress-seo" ),
		pageTypeLabel: __( "Page type", "wordpress-seo" ),
		postTypeName: window.wpseoAdminL10n.postTypeNamePlural,
		helpTextTitle: __( "Yoast SEO automatically describes your pages using schema.org", "wordpress-seo" ),
		helpTextDescription: __(
			"This helps search engines understand your website and your content. You can change some of your settings for this page below.",
			"wordpress-seo"
		),
		showArticleTypeInput,
		pageTypeOptions,
		articleTypeOptions,
	};

	const schemaTabProps = {
		...props,
		...baseProps,
		...getLocationBasedProps( props.location ),
	};

	return <SchemaTab { ...schemaTabProps } />;
};

export default compose( [
	withSelect( select => {
		const {
			getPreferences,
			getPageType,
			getDefaultPageType,
			getArticleType,
			getDefaultArticleType,
		} = select( "yoast-seo/editor" );

		const { displaySchemaSettingsFooter: displayFooter, isNewsEnabled } = getPreferences();

		return {
			displayFooter,
			isNewsEnabled,
			schemaPageTypeSelected: getPageType(),
			schemaArticleTypeSelected: getArticleType(),
			defaultArticleType: getDefaultArticleType(),
			defaultPageType: getDefaultPageType(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setPageType,
			setArticleType,
			getSchemaPageData,
			getSchemaArticleData,
		} = dispatch( "yoast-seo/editor" );

		return {
			loadSchemaPageData: getSchemaPageData,
			loadSchemaArticleData: getSchemaArticleData,
			schemaPageTypeChange: setPageType,
			schemaArticleTypeChange: setArticleType,
		};
	} ),
	withLocation(),
] )( SchemaTabContainer );
