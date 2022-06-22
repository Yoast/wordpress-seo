import { createPortal, Fragment, useCallback, useEffect, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, FieldGroup, Select } from "@yoast/components";
import { Slot } from "@wordpress/components";
import { makeOutboundLink, join } from "@yoast/helpers";
import interpolateComponents from "interpolate-components";
import PropTypes from "prop-types";
import styled from "styled-components";
import { schemaTypeOptionsPropType } from "./SchemaSettings";
import { isFeatureEnabled } from "@yoast/feature-flag";

const NewsLandingPageLink = makeOutboundLink();

const SchemaContainer = styled.div`
	padding: 16px;
`;

/**
 * The NewsAlert upsell.
 *
 * @param {Object} props      The props Object.
 * @param {Object} props.show Whether or not to show the NewsAlert
 *
 * @returns {WPElement|Null} The NewsAlert component.
 */
function NewsAlert( { show } ) {
	if ( ! show ) {
		return null;
	}
	return <Alert type="info">
		{
			sprintf(
				/* translators: %s Expands to "News SEO" */
				__(
					"Do you have news articles on your site? Our %s plugin helps you to optimize your site for Google News and the likes!",
					"wordpress-seo"
				),
				"News SEO"
			) + " "
		}
		<NewsLandingPageLink
			href={ window.wpseoAdminL10n[ "shortlinks.upsell.editor.news" ] }
		>
			{
				sprintf(
					/* translators: %s: Expands to "Yoast News SEO". */
					__( "Get the %s plugin!", "wordpress-seo" ),
					"Yoast News SEO"
				)
			}
		</NewsLandingPageLink>
	</Alert>;
}

NewsAlert.propTypes = {
	show: PropTypes.bool.isRequired,
};

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
	const schemaOption = schemaTypeOptions.find( option => option.value === defaultType );
	return [
		{
			name: sprintf(
				/* translators: %1$s expands to the plural name of the current post type, %2$s expands to the current site wide default. */
				__( "Default for %1$s (%2$s)", "wordpress-seo" ),
				postTypeName,
				schemaOption ? schemaOption.name : ""
			),
			value: "",
		},
		...schemaTypeOptions,
	];
};

/**
 * Function that uses a postTypeName to create a string which will be used to create a link to the Search Appearance settings.
 *
 * @param {string} postTypeName The name of the current post type.
 *
 * @returns {string} A string that contains tags that will be interpolated.
 */
const footerText = ( postTypeName ) => sprintf(
	/* translators: %1$s expands to the plural name of the current post type, %2$s and %3$s expand to a link to the Search Appearance Settings page */
	__( "You can change the default type for %1$s in your %2$sSearch Appearance Settings%3$s.", "wordpress-seo" ),
	postTypeName,
	"{{link}}",
	"{{/link}}"
);

/**
 * Interpolates the footerText string with an actual link component.
 *
 * @param {string} postTypeName  The name of the current post type.
 *
 * @returns {string} A link to the Search Appearance settings.
 */
const footerWithLink = ( postTypeName ) => interpolateComponents(
	{
		mixedString: footerText( postTypeName ),
		// eslint-disable-next-line jsx-a11y/anchor-has-content
		components: { link: <a href="/wp-admin/admin.php?page=wpseo_titles#top#post-types" target="_blank" /> },
	}
);

/**
 * The 'normal' header for the Schema tab, for when the Schema blocks have not been enabled.
 *
 * @param {Object} props The props.
 *
 * @returns {JSX.Element} The header.
 */
const Header = ( props ) => {
	return <FieldGroup
		label={ props.helpTextTitle }
		linkTo={ props.helpTextLink }
		linkText={ __( "Learn more about structured data with Schema.org", "wordpress-seo" ) }
		description={ props.helpTextDescription }
	/>;
};

Header.propTypes = {
	helpTextTitle: PropTypes.string.isRequired,
	helpTextLink: PropTypes.string.isRequired,
	helpTextDescription: PropTypes.string.isRequired,
};

/**
 * The header for the Schema tab, for when the Schema blocks have been enabled.
 *
 * @param {Object} props The props.
 *
 * @returns {JSX.Element} The header.
 */
const SchemaBlocksHeader = ( props ) => {
	return <p>
		{ props.helpTextDescription + " " }
		<a href={ props.helpTextLink }>{ __( "Read more about Schema.", "wordpress-seo" ) }</a>
	</p>;
};

SchemaBlocksHeader.propTypes = {
	helpTextDescription: PropTypes.string.isRequired,
	helpTextLink: PropTypes.string.isRequired,
};

/**
 * Whether or not NewsArticle is the Article Type.
 * @param {string} selectedValue The value that is selected.
 * @param {string} defaultValue  The default value for this post type.
 * @returns {Boolean} Whether or not NewsArticle is the Article Type.
 */
function isNewsArticleType( selectedValue, defaultValue ) {
	if ( selectedValue === "NewsArticle" ) {
		return true;
	} else if ( selectedValue === "" && defaultValue === "NewsArticle" ) {
		return true;
	}
	return false;
}

/**
 * Returns the content of the schema tab.
 *
 * @param {object} props Component props.
 *
 * @returns {JSX.Element} The schema tab content.
 */
const Content = ( props ) => {
	const schemaPageTypeOptions = getSchemaTypeOptions( props.pageTypeOptions, props.defaultPageType, props.postTypeName );
	const schemaArticleTypeOptions = getSchemaTypeOptions( props.articleTypeOptions, props.defaultArticleType, props.postTypeName );

	const schemaBlocksEnabled = isFeatureEnabled( "SCHEMA_BLOCKS" );

	const [ focusedArticleType, setFocusedArticleType ] = useState( props.schemaArticleTypeSelected );

	const handleOptionChange = useCallback(
		( _, value ) => {
			setFocusedArticleType( value );
		},
		[ focusedArticleType ] );

	useEffect(
		() => {
			handleOptionChange( null, props.schemaArticleTypeSelected );
		},
		[ props.schemaArticleTypeSelected ]
	);

	return (
		<Fragment>
			{ schemaBlocksEnabled ? <SchemaBlocksHeader { ...props } /> : <Header { ...props } /> }
			{ schemaBlocksEnabled && <Slot name={ join( [ "yoast-schema-blocks-analysis", props.location ] ) } /> }
			<FieldGroup
				label={ __( "What type of page or content is this?", "wordpress-seo" ) }
				linkTo={ props.additionalHelpTextLink }
				linkText={ __( "Learn more about page or content types", "wordpress-seo" ) }
			/>
			<Select
				id={ join( [ "yoast-schema-page-type", props.location ] ) }
				options={ schemaPageTypeOptions }
				label={ __( "Page type", "wordpress-seo" ) }
				onChange={ props.schemaPageTypeChange }
				selected={ props.schemaPageTypeSelected }
			/>
			{ props.showArticleTypeInput && <Select
				id={ join( [ "yoast-schema-article-type", props.location ] ) }
				options={ schemaArticleTypeOptions }
				label={ __( "Article type", "wordpress-seo" ) }
				onChange={ props.schemaArticleTypeChange }
				selected={ props.schemaArticleTypeSelected }
				onOptionFocus={ handleOptionChange }
			/> }
			<NewsAlert show={ ! props.isNewsEnabled && isNewsArticleType( focusedArticleType, props.defaultArticleType ) } />
			{ props.displayFooter && <p>{ footerWithLink( props.postTypeName ) }</p> }
		</Fragment>
	);
};

Content.propTypes = {
	schemaPageTypeChange: PropTypes.func,
	schemaPageTypeSelected: PropTypes.string,
	pageTypeOptions: schemaTypeOptionsPropType.isRequired,
	schemaArticleTypeChange: PropTypes.func,
	schemaArticleTypeSelected: PropTypes.string,
	articleTypeOptions: schemaTypeOptionsPropType.isRequired,
	showArticleTypeInput: PropTypes.bool.isRequired,
	additionalHelpTextLink: PropTypes.string.isRequired,
	helpTextLink: PropTypes.string.isRequired,
	helpTextTitle: PropTypes.string.isRequired,
	helpTextDescription: PropTypes.string.isRequired,
	postTypeName: PropTypes.string.isRequired,
	displayFooter: PropTypes.bool,
	defaultPageType: PropTypes.string.isRequired,
	defaultArticleType: PropTypes.string.isRequired,
	location: PropTypes.string.isRequired,
	isNewsEnabled: PropTypes.bool,
};

Content.defaultProps = {
	schemaPageTypeChange: () => {},
	schemaPageTypeSelected: null,
	schemaArticleTypeChange: () => {},
	schemaArticleTypeSelected: null,
	displayFooter: false,
	isNewsEnabled: false,
};

/**
 * Renders the schema tab.
 *
 * @param {object} props The component props.
 *
 * @returns {React.Component} The schema tab.
 */
const SchemaTab = ( props ) => {
	if ( props.isMetabox ) {
		return createPortal(
			<SchemaContainer>
				<Content { ...props } />
			</SchemaContainer>,
			document.getElementById( "wpseo-meta-section-schema" )
		);
	}

	return (
		<Content { ...props } />
	);
};

SchemaTab.propTypes = {
	showArticleTypeInput: PropTypes.bool,
	articleTypeLabel: PropTypes.string,
	additionalHelpTextLink: PropTypes.string,
	pageTypeLabel: PropTypes.string.isRequired,
	helpTextLink: PropTypes.string.isRequired,
	helpTextTitle: PropTypes.string.isRequired,
	helpTextDescription: PropTypes.string.isRequired,
	isMetabox: PropTypes.bool.isRequired,
	postTypeName: PropTypes.string.isRequired,
	displayFooter: PropTypes.bool,
	loadSchemaArticleData: PropTypes.func.isRequired,
	loadSchemaPageData: PropTypes.func.isRequired,
	location: PropTypes.string.isRequired,
};

SchemaTab.defaultProps = {
	showArticleTypeInput: false,
	articleTypeLabel: "",
	additionalHelpTextLink: "",
	displayFooter: false,
};

export default SchemaTab;
