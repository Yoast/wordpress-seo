/* eslint-disable complexity */
import { createPortal, Fragment, useCallback, useEffect, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, FieldGroup, Select } from "@yoast/components";
import { makeOutboundLink, join } from "@yoast/helpers";
import PropTypes from "prop-types";
import styled from "styled-components";
import { safeCreateInterpolateElement } from "../helpers/i18n";
import WooCommerceUpsell from "./WooCommerceUpsell";
import { useSelect } from "@wordpress/data";
import { noop } from "lodash";

/**
 * @typedef {Object} SchemaTypeOption
 * @property {string} name The name.
 * @property {string} value The value.
 */

const NewsLandingPageLink = makeOutboundLink();

const SchemaContainer = styled.div`
	padding: 16px;
`;

const STORE = "yoast-seo/editor";

/**
 * The NewsAlert upsell.
 *
 * @param {string} location The location identifier.
 * @param {boolean} show Whether or not to show the NewsAlert.
 *
 * @returns {JSX.Element} The NewsAlert, or null if not showing.
 */
function NewsAlert( { location, show } ) {
	if ( ! show ) {
		return null;
	}
	return <Alert type="info">
		{
			sprintf(
				/* translators: %s Expands to "Yoast News SEO" */
				__(
					"Are you working on a news article? %s helps you optimize your site for Google News.",
					"wordpress-seo"
				),
				"Yoast News SEO"
			) + " "
		}
		<NewsLandingPageLink
			href={ window.wpseoAdminL10n[ `shortlinks.upsell.${ location }.news` ] }
		>
			{
				sprintf(
					/* translators: %s: Expands to "Yoast News SEO". */
					__( "Buy %s now!", "wordpress-seo" ),
					"Yoast News SEO"
				)
			}
		</NewsLandingPageLink>
	</Alert>;
}

NewsAlert.propTypes = {
	show: PropTypes.bool.isRequired,
	location: PropTypes.string.isRequired,
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
	const isProduct = useSelect( ( select ) => select( STORE ).getIsProduct(), [] );
	const isWooSeoActive = useSelect( select => select( STORE ).getIsWooSeoActive(), [] );
	const disablePageTypeSelect = isProduct && isWooSeoActive;
	const schemaOption = disablePageTypeSelect ? { name: __( "Item Page", "wordpress-seo" ), value: "ItemPage" } : schemaTypeOptions.find( option => option.value === defaultType );
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
	/* translators: %1$s expands to the plural name of the current post type, %2$s and %3$s expand to a link to the Settings page */
	__( "You can change the default type for %1$s under Content types in the %2$sSettings%3$s.", "wordpress-seo" ),
	postTypeName,
	"<link>",
	"</link>"
);

/**
 * Interpolates the footerText string with an actual link component.
 *
 * @param {string} postTypeName  The name of the current post type.
 * @param {string} href          The href for the link.
 *
 * @returns {string} A link to the Search Appearance settings.
 */
const footerWithLink = ( postTypeName, href ) => safeCreateInterpolateElement(
	footerText( postTypeName ),
	// eslint-disable-next-line jsx-a11y/anchor-has-content
	{ link: <a href={ href } target="_blank" rel="noreferrer" /> }
);

/**
 * The 'normal' header for the Schema tab, for when the Schema blocks have not been enabled.
 *
 * @param {string} helpTextTitle The help text title.
 * @param {string} helpTextLink The help text link.
 * @param {string} helpTextDescription The help text description.
 *
 * @returns {JSX.Element} The header.
 */
const Header = ( { helpTextTitle, helpTextLink, helpTextDescription } ) => {
	return <FieldGroup
		label={ helpTextTitle }
		linkTo={ helpTextLink }
		/* translators: Hidden accessibility text. */
		linkText={ __( "Learn more about structured data with Schema.org", "wordpress-seo" ) }
		description={ helpTextDescription }
	/>;
};

Header.propTypes = {
	helpTextTitle: PropTypes.string.isRequired,
	helpTextLink: PropTypes.string.isRequired,
	helpTextDescription: PropTypes.string.isRequired,
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
 * @param {Function} [schemaPageTypeChange=noop] Callback for page type change.
 * @param {?string} [schemaPageTypeSelected=null] The selected page type.
 * @param {Array<SchemaTypeOption>} pageTypeOptions The page type options.
 * @param {Function} [schemaArticleTypeChange=noop] Callback for article type change.
 * @param {?string} [schemaArticleTypeSelected=null] The selected article type.
 * @param {Array<SchemaTypeOption>} articleTypeOptions The article type options.
 * @param {boolean} showArticleTypeInput Whether to show the article type input.
 * @param {string} additionalHelpTextLink The additional help text link.
 * @param {string} helpTextLink The help text link.
 * @param {string} helpTextTitle The help text title.
 * @param {string} helpTextDescription The help text description.
 * @param {string} postTypeName The post type name.
 * @param {boolean} [displayFooter=false] Whether to display the footer.
 * @param {string} defaultPageType The default page type.
 * @param {string} defaultArticleType The default article type.
 * @param {string} location The location identifier.
 * @param {boolean} [isNewsEnabled=false] Whether news is enabled.
 *
 * @returns {JSX.Element} The schema tab content.
 */
const Content = ( {
	schemaPageTypeChange = noop,
	schemaPageTypeSelected = null,
	pageTypeOptions,
	schemaArticleTypeChange = noop,
	schemaArticleTypeSelected = null,
	articleTypeOptions,
	showArticleTypeInput,
	additionalHelpTextLink,
	helpTextLink,
	helpTextTitle,
	helpTextDescription,
	postTypeName,
	displayFooter = false,
	defaultPageType,
	defaultArticleType,
	location,
	isNewsEnabled = false,
} ) => {
	const schemaPageTypeOptions = getSchemaTypeOptions( pageTypeOptions, defaultPageType, postTypeName );
	const schemaArticleTypeOptions = getSchemaTypeOptions( articleTypeOptions, defaultArticleType, postTypeName );
	const woocommerceUpsellLink = useSelect( select => select( STORE ).selectLink( "https://yoa.st/product-schema-metabox" ), [] );
	const woocommerceUpsell = useSelect( ( select ) => select( STORE ).getIsWooSeoUpsell(), [] );
	const [ focusedArticleType, setFocusedArticleType ] = useState( schemaArticleTypeSelected );
	const woocommerceUpsellText = __( "Want your products stand out in search results with rich results like price, reviews and more?", "wordpress-seo" );
	const isProduct = useSelect( ( select ) => select( STORE ).getIsProduct(), [] );
	const isWooSeoActive = useSelect( select => select( STORE ).getIsWooSeoActive(), [] );
	const settingsLink = useSelect( select => select( STORE ).selectAdminLink( "?page=wpseo_page_settings" ), [] );

	const disablePageTypeSelect = isProduct && isWooSeoActive;

	const handleOptionChange = useCallback( ( _, value ) => {
		setFocusedArticleType( value );
	}, [] );

	useEffect( () => {
		handleOptionChange( null, schemaArticleTypeSelected );
	}, [ schemaArticleTypeSelected ] );

	return (
		<Fragment>
			<Header helpTextLink={ helpTextLink } helpTextTitle={ helpTextTitle } helpTextDescription={ helpTextDescription } />
			<FieldGroup
				label={ __( "What type of page or content is this?", "wordpress-seo" ) }
				linkTo={ additionalHelpTextLink }
				/* translators: Hidden accessibility text. */
				linkText={ __( "Learn more about page or content types", "wordpress-seo" ) }
			/>
			{ woocommerceUpsell && <WooCommerceUpsell link={ woocommerceUpsellLink } text={ woocommerceUpsellText } /> }
			<Select
				id={ join( [ "yoast-schema-page-type", location ] ) }
				options={ schemaPageTypeOptions }
				label={ __( "Page type", "wordpress-seo" ) }
				onChange={ schemaPageTypeChange }
				selected={ disablePageTypeSelect ? "ItemPage" : schemaPageTypeSelected }
				disabled={ disablePageTypeSelect }
			/>
			{ showArticleTypeInput && <Select
				id={ join( [ "yoast-schema-article-type", location ] ) }
				options={ schemaArticleTypeOptions }
				label={ __( "Article type", "wordpress-seo" ) }
				onChange={ schemaArticleTypeChange }
				selected={ schemaArticleTypeSelected }
				onOptionFocus={ handleOptionChange }
			/> }
			<NewsAlert
				location={ location }
				show={ ! isNewsEnabled && isNewsArticleType( focusedArticleType, defaultArticleType ) }
			/>
			{ displayFooter && ! disablePageTypeSelect && <p>{ footerWithLink( postTypeName, settingsLink ) }</p> }
			{ disablePageTypeSelect && <p>
				{ sprintf(
					/* translators: %1$s expands to Yoast WooCommerce SEO. */
					__( "You have %1$s activated on your site, automatically setting the Page type for your products to 'Item Page'. As a result, the Page type selection is disabled.", "wordpress-seo" ),
					"Yoast WooCommerce SEO"
				) }
			</p> }
		</Fragment>
	);
};

const schemaTypeOptionsPropType = PropTypes.arrayOf( PropTypes.shape( {
	name: PropTypes.string,
	value: PropTypes.string,
} ) );

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

/**
 * Renders the schema tab.
 *
 * @param {boolean} [showArticleTypeInput=false] Whether to show the article type input.
 * @param {string} [articleTypeLabel=""] The article type label.
 * @param {string} [additionalHelpTextLink=""] The additional help text link.
 * @param {string} pageTypeLabel The page type label.
 * @param {string} helpTextLink The help text link.
 * @param {string} helpTextTitle The help text title.
 * @param {string} helpTextDescription The help text description.
 * @param {boolean} isMetabox Whether this is in the metabox.
 * @param {string} postTypeName The post type name.
 * @param {boolean} [displayFooter=false] Whether to display the footer.
 * @param {Function} loadSchemaArticleData Callback to load schema article data.
 * @param {Function} loadSchemaPageData Callback to load schema page data.
 * @param {string} location The location identifier.
 * @param {...Object} [props] Additional props.
 *
 * @returns {JSX.Element} The schema tab.
 */
const SchemaTab = ( {
	isMetabox,
	showArticleTypeInput = false,
	articleTypeLabel = "",
	additionalHelpTextLink = "",
	pageTypeLabel,
	helpTextLink,
	helpTextTitle,
	helpTextDescription,
	postTypeName,
	displayFooter = false,
	loadSchemaArticleData,
	loadSchemaPageData,
	location,
	...props
} ) => {
	// Leaving out the "isMetabox" prop.
	const content = <Content
		showArticleTypeInput={ showArticleTypeInput }
		articleTypeLabel={ articleTypeLabel }
		additionalHelpTextLink={ additionalHelpTextLink }
		pageTypeLabel={ pageTypeLabel }
		helpTextLink={ helpTextLink }
		helpTextTitle={ helpTextTitle }
		helpTextDescription={ helpTextDescription }
		postTypeName={ postTypeName }
		displayFooter={ displayFooter }
		loadSchemaArticleData={ loadSchemaArticleData }
		loadSchemaPageData={ loadSchemaPageData }
		location={ location }
		{ ...props }
	/>;

	if ( isMetabox ) {
		return createPortal(
			<SchemaContainer>
				{ content }
			</SchemaContainer>,
			document.getElementById( "wpseo-meta-section-schema" )
		);
	}

	return content;
};

SchemaTab.propTypes = {
	isMetabox: PropTypes.bool.isRequired,
	showArticleTypeInput: PropTypes.bool,
	articleTypeLabel: PropTypes.string,
	additionalHelpTextLink: PropTypes.string,
	pageTypeLabel: PropTypes.string.isRequired,
	helpTextLink: PropTypes.string.isRequired,
	helpTextTitle: PropTypes.string.isRequired,
	helpTextDescription: PropTypes.string.isRequired,
	postTypeName: PropTypes.string.isRequired,
	displayFooter: PropTypes.bool,
	loadSchemaArticleData: PropTypes.func.isRequired,
	loadSchemaPageData: PropTypes.func.isRequired,
	location: PropTypes.string.isRequired,
};

export default SchemaTab;
