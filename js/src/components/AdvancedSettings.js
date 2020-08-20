import { __, sprintf } from "@wordpress/i18n";
import { MultiSelect, Select } from "@yoast/components";
import { RadioButtonGroup } from "@yoast/components";
import { TextInput } from "@yoast/components";
import { curryUpdateToHiddenInput, getValueFromHiddenInput } from "@yoast/helpers";
import { Fragment } from "@wordpress/element";
import { Alert } from "@yoast/components";
import PropTypes from "prop-types";

/**
 * Boolean that tells whether the current object refers to a post or a taxonomy.
 *
 * @returns {Boolean} Whether this is a post or not.
 */
const isPost = () => !! window.wpseoScriptData.isPost;

/**
 * If location is not empty, we append it to the id, to keep id's unique.
 *
 * @param {string} id       The id.
 * @param {string} location The location.
 *
 * @returns {string} The hopefully unique id.
 */
const appendLocation = ( id, location ) => {
	if ( location ) {
		return `${ id }_${ location }`;
	}

	return id;
};

/**
 * The values that are used for the noIndex field differ for posts and taxonomies. This function returns an array of
 * options that can be used to populate a select field.
 *
 * @returns {void} Array Returns an array of options for the noIndex setting.
 */
const getNoIndexOptions = () => {
	const translatedNo = __( "No", "wordpress-seo" );
	const translatedYes = __( "Yes", "wordpress-seo" );
	const noIndex = window.wpseoAdminL10n.noIndex ? translatedNo : translatedYes;

	if ( isPost() ) {
		return [
			{
				name: sprintf(
					/* Translators: %s translates to "yes" or "no", %s translates to the Post Label in plural form */
					__( "%s (current default for %s)", "wordpress-seo" ),
					noIndex,
					window.wpseoAdminL10n.postTypeNamePlural,
				),
				value: "0",
			},
			{ name: translatedNo, value: "1" },
			{ name: translatedYes, value: "2" },
		];
	}
	return [
		{
			name: sprintf(
				/* Translators: %s translates to the "yes" or "no" ,%s translates to the Post Label in plural form */
				__( "%s (current default for %s)", "wordpress-seo" ),
				noIndex,
				window.wpseoAdminL10n.postTypeNamePlural,
			),
			value: "default",
		},
		{ name: translatedYes, value: "index" },
		{ name: translatedNo, value: "noindex" },
	];
};

/**
 * Functional component for the Meta Robots No-Index option.
 *
 * @param {Object} props The props object
 *
 * @returns {Component} The Meta Robots No-Index component.
 */
const MetaRobotsNoIndex = ( { location } ) => {
	const hiddenInputId = isPost() ? "#yoast_wpseo_meta-robots-noindex" : "#hidden_wpseo_noindex";
	const metaRobotsNoIndexOptions = getNoIndexOptions();
	const value = getValueFromHiddenInput( hiddenInputId );
	const id = appendLocation( "yoast_wpseo_meta-robots-noindex-react", location );
	return <Fragment>
		{
			window.wpseoAdminL10n.privateBlog &&
			<Alert type="warning">
				{ __(
					"Even though you can set the meta robots setting here, the entire site is set to noindex in the sitewide privacy settings, " +
					"so these settings won't have an effect.",
					"wordpress-seo"
				) }
			</Alert>
		}
		<Select
			label={
				sprintf(
					/* Translators: %s translates to the Post Label in singular form */
					__( "Allow search engines to show this %s in search results?", "wordpress-seo" ),
					window.wpseoAdminL10n.postTypeNameSingular,
				) }
			onChange={ curryUpdateToHiddenInput( hiddenInputId ) }
			name={ "yoast_wpseo_meta-robots-noindex-react" }
			id={ id }
			options={ metaRobotsNoIndexOptions }
			selected={ value }
			linkTo={ "https://yoa.st/allow-search-engines" }
			linkText={ __( "Learn more about the no-index setting on our help page.", "wordpress-seo" ) }
		/>
	</Fragment>;
};

MetaRobotsNoIndex.propTypes = {
	location: PropTypes.string,
};

MetaRobotsNoIndex.defaultProps = {
	location: "",
};

/**
 * Functional component for the Meta Robots No-Follow option.
 *
 * @returns {Component} The Meta Robots No-Follow option.
 */
const MetaRobotsNoFollow = () => {
	const hiddenInputId = "#yoast_wpseo_meta-robots-nofollow";
	const value = getValueFromHiddenInput( hiddenInputId );

	return <RadioButtonGroup
		options={ [ { value: "0", label: "Yes" }, { value: "1", label: "No" } ] }
		label={ sprintf(
			/* Translators: %s translates to the Post Label in singular form */
			__( "Should search engines follow links on this %s", "wordpress-seo" ),
			window.wpseoAdminL10n.postTypeNameSingular,
		) }
		groupName="yoast_wpseo_meta-robots-nofollow-react"
		onChange={ curryUpdateToHiddenInput( hiddenInputId ) }
		selected={ value }
		linkTo={ "https://yoa.st/follow-links" }
		linkText={ __( "Learn more about the no-follow setting on our help page.", "wordpress-seo" ) }
	/>;
};

/**
 * Functional component for the Meta Robots Advanced field.
 *
 * @param {Object} props The props object
 *
 * @returns {Component} The Meta Robots advanced field component.
 */
const MetaRobotsAdvanced = ( { location } ) => {
	const hiddenInputId = "#yoast_wpseo_meta-robots-adv";
	const value = getValueFromHiddenInput( hiddenInputId );
	const id = appendLocation( "yoast_wpseo_meta-robots-adv-react", location );

	return <MultiSelect
		label={ __( "Meta robots advanced", "wordpress-seo" ) }
		onChange={ curryUpdateToHiddenInput( hiddenInputId ) }
		name="yoast_wpseo_meta-robots-adv-react"
		id={ id }
		options={ [
			{ name: __( "No Image Index", "wordpress-seo" ), value: "noimageindex" },
			{ name: __( "No Archive", "wordpress-seo" ), value: "noarchive" },
			{ name: __( "No Snippet", "wordpress-seo" ), value: "nosnippet" },
		] }
		selected={ value.split( "," ) }
		linkTo={ "https://yoa.st/meta-robots-advanced" }
		linkText={ __( "Learn more about advanced meta robots settings on our help page.", "wordpress-seo" ) }
	/>;
};

MetaRobotsAdvanced.propTypes = {
	location: PropTypes.string,
};

MetaRobotsAdvanced.defaultProps = {
	location: "",
};

/**
 * Functional component for the Breadcrumbs Title.
 *
 * @param {Object} props The props object
 *
 * @returns {Component} The Breadcrumbs title component.
 */
const BreadcrumbsTitle = ( { location } ) => {
	const hiddenInputId = isPost() ? "#yoast_wpseo_bctitle" : "#hidden_wpseo_bctitle";
	const value = getValueFromHiddenInput( hiddenInputId );
	const id = appendLocation( "yoast_wpseo_bctitle-react", location );

	return <TextInput
		label={ __( "Breadcrumbs Title", "wordpress-seo" ) }
		id={ id }
		name="yoast_wpseo_bctitle-react"
		onChange={ curryUpdateToHiddenInput( hiddenInputId ) }
		value={ value }
		linkTo={ "https://yoa.st/breadcrumbs-title" }
		linkText={ __( "Learn more about the breadcrumbs title setting on our help page.", "wordpress-seo" ) }
	/>;
};

BreadcrumbsTitle.propTypes = {
	location: PropTypes.string,
};

BreadcrumbsTitle.defaultProps = {
	location: "",
};

/**
 * Functional component for the Canonical URL.
 *
 * @param {Object} props The props object
 *
 * @returns {Component} The canonical URL component.
 */
const CanonicalURL = ( { location } ) => {
	const hiddenInputId = isPost() ? "#yoast_wpseo_canonical" : "#hidden_wpseo_canonical";
	const value = getValueFromHiddenInput( hiddenInputId );
	const id = appendLocation( "yoast_wpseo_canonical-react", location );

	return <TextInput
		label={ __( "Canonical URL", "wordpress-seo" ) }
		id={ id }
		name="yoast_wpseo_canonical-react"
		onChange={ curryUpdateToHiddenInput( hiddenInputId ) }
		value={ value }
		linkTo={ "https://yoa.st/canonical-url" }
		linkText={ __( "Learn more about canonical URLs on our help page.", "wordpress-seo" ) }
	/>;
};

CanonicalURL.propTypes = {
	location: PropTypes.string,
};

CanonicalURL.defaultProps = {
	location: "",
};

/**
 * The Advanced Settings component.
 *
 * @param {Object} props The props object
 *
 * @returns {wp.Element} The AdvancedSettings component.
 */
const AdvancedSettings = ( { location } ) => {
	return (
		<Fragment>
			<MetaRobotsNoIndex location={ location } />
			{ isPost() && <MetaRobotsNoFollow /> }
			{ isPost() && <MetaRobotsAdvanced location={ location } /> }
			{
				! window.wpseoAdminL10n.breadcrumbsDisabled && <BreadcrumbsTitle location={ location } />
			}
			<CanonicalURL location={ location } />
		</Fragment>
	);
};

AdvancedSettings.propTypes = {
	location: PropTypes.string,
};

AdvancedSettings.defaultProps = {
	location: "",
};

export default AdvancedSettings;
