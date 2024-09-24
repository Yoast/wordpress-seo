import { createPortal, Fragment, useCallback, useEffect, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, FieldGroup, Select } from "@yoast/components";
import { makeOutboundLink, join } from "@yoast/helpers";
import interpolateComponents from "interpolate-components";
import PropTypes from "prop-types";
import styled from "styled-components";
import WooCommerceUpsell from "./WooCommerceUpsell";
import { useSelect } from "@wordpress/data";

const NewsLandingPageLink = makeOutboundLink();

const SchemaContainer = styled.div`
	padding: 16px;
`;

const STORE = "yoast-seo/editor";

/**
 * The NewsAlert upsell.
 *
 * @param {Object} props      The props Object.
 * @param {Object} props.show Whether or not to show the NewsAlert
 *
 * @returns {WPElement|Null} The NewsAlert component.
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
	"{{link}}",
	"{{/link}}"
);

/**
 * Interpolates the footerText string with an actual link component.
 *
 * @param {string} postTypeName  The name of the current post type.
 * @param {string} href          The href for the link.
 *
 * @returns {string} A link to the Search Appearance settings.
 */
const footerWithLink = ( postTypeName, href ) => interpolateComponents(
	{
		mixedString: footerText( postTypeName ),
		// eslint-disable-next-line jsx-a11y/anchor-has-content
		components: { link: <a href={ href } target="_blank" rel="noreferrer" /> },
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
		/* translators: Hidden accessibility text. */
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

/* eslint-disable complexity */
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
	const woocommerceUpsellLink = useSelect( select => select( STORE ).selectLink( "https://yoa.st/product-schema-metabox" ), [] );
	const woocommerceUpsell = useSelect( ( select ) => select( STORE ).getIsWooSeoUpsell(), [] );
	const [ focusedArticleType, setFocusedArticleType ] = useState( props.schemaArticleTypeSelected );
	const woocommerceUpsellText = __( "Want your products stand out in search results with rich results like price, reviews and more?", "wordpress-seo" );
	const isProduct = useSelect( ( select ) => select( STORE ).getIsProduct(), [] );
	const isWooSeoActive = useSelect( select => select( STORE ).getIsWooSeoActive(), [] );
	const settingsLink = useSelect( select => select( STORE ).selectAdminLink( "?page=wpseo_page_settings" ), [] );

	const disablePageTypeSelect = isProduct && isWooSeoActive;

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
			<FieldGroup
				label={ __( "What type of page or content is this?", "wordpress-seo" ) }
				linkTo={ props.additionalHelpTextLink }
				/* translators: Hidden accessibility text. */
				linkText={ __( "Learn more about page or content types", "wordpress-seo" ) }
			/>
			{ woocommerceUpsell && <WooCommerceUpsell link={ woocommerceUpsellLink } text={ woocommerceUpsellText } /> }
			<Select
				id={ join( [ "yoast-schema-page-type", props.location ] ) }
				options={ schemaPageTypeOptions }
				label={ __( "Page type", "wordpress-seo" ) }
				onChange={ props.schemaPageTypeChange }
				selected={ disablePageTypeSelect ? "ItemPage" : props.schemaPageTypeSelected }
				disabled={ disablePageTypeSelect }
			/>
			{ props.showArticleTypeInput && <Select
				id={ join( [ "yoast-schema-article-type", props.location ] ) }
				options={ schemaArticleTypeOptions }
				label={ __( "Article type", "wordpress-seo" ) }
				onChange={ props.schemaArticleTypeChange }
				selected={ props.schemaArticleTypeSelected }
				onOptionFocus={ handleOptionChange }
			/> }
			<NewsAlert
				location={ props.location }
				show={ ! props.isNewsEnabled && isNewsArticleType( focusedArticleType, props.defaultArticleType ) }
			/>
			{ props.displayFooter && ! disablePageTypeSelect && <p>{ footerWithLink( props.postTypeName, settingsLink ) }</p> }
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
/* eslint-enable complexity */

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
