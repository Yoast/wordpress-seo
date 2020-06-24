import MetaboxCollapsible from "./MetaboxCollapsible";
import { __, sprintf } from "@wordpress/i18n";
import { MultiSelect, Select } from "@yoast/components";
import { RadioButtonGroup } from "@yoast/components";
import { TextInput } from "@yoast/components";
import { curryUpdateToHiddenInput, getValueFromHiddenInput } from "@yoast/helpers";
import { Component, Fragment } from "@wordpress/element";
import { Alert } from "@yoast/components";

/**
 * Boolean that tells whether the current object refers to a post or a taxonomy.
 *
 * @returns {Boolean} Whether this is a post or not.
 */
const isPost = () => !! window.wpseoScriptData.isPost;

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
 * @returns {Component} The Meta Robots No-Index component.
 */
const MetaRobotsNoIndex = () => {
	const hiddenInputId = isPost() ? "#yoast_wpseo_meta-robots-noindex" : "#hidden_wpseo_noindex";
	const metaRobotsNoIndexOptions = getNoIndexOptions();
	const value = getValueFromHiddenInput( hiddenInputId );
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
			id={ "yoast_wpseo_meta-robots-noindex-react" }
			options={ metaRobotsNoIndexOptions }
			selected={ value }
			linkTo={ "https://yoa.st/allow-search-engines" }
			linkText={ __( "Learn more about the no-index setting on our help page.", "wordpress-seo" ) }
		/>
	</Fragment>;
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
 * @returns {Component} The Meta Robots advanced field component.
 */
const MetaRobotsAdvanced = () => {
	const hiddenInputId = "#yoast_wpseo_meta-robots-adv";
	const value = getValueFromHiddenInput( hiddenInputId );

	return <MultiSelect
		label={ __( "Meta robots advanced", "wordpress-seo" ) }
		onChange={ curryUpdateToHiddenInput( hiddenInputId ) }
		name="yoast_wpseo_meta-robots-adv-react"
		id="yoast_wpseo_meta-robots-adv-react"
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

/**
 * Functional component for the Breadcrumbs Title.
 *
 * @returns {Component} The Breadcrumbs title component.
 */
const BreadCrumbsTitle = () => {
	const hiddenInputId = isPost() ? "#yoast_wpseo_bctitle" : "#hidden_wpseo_bctitle";
	const value = getValueFromHiddenInput( hiddenInputId );

	return <TextInput
		label={ __( "Breadcrumbs Title", "wordpress-seo" ) }
		id="yoast_wpseo_bctitle-react"
		name="yoast_wpseo_bctitle-react"
		onChange={ curryUpdateToHiddenInput( hiddenInputId ) }
		value={ value }
		linkTo={ "https://yoa.st/breadcrumbs-title" }
		linkText={ __( "Learn more about the breadcrumbs title setting on our help page.", "wordpress-seo" ) }
	/>;
};

/**
 * Functional component for the Canonical URL.
 *
 * @returns {Component} The canonical URL component.
 */
const CanonicalURL = () => {
	const hiddenInputId = isPost() ? "#yoast_wpseo_canonical" : "#hidden_wpseo_canonical";
	const value = getValueFromHiddenInput( hiddenInputId );

	return <TextInput
		label={ __( "Canonical URL", "wordpress-seo" ) }
		id="yoast_wpseo_canonical-react"
		name="yoast_wpseo_canonical-react"
		onChange={ curryUpdateToHiddenInput( hiddenInputId ) }
		value={ value }
		linkTo={ "https://yoa.st/canonical-url" }
		linkText={ __( "Learn more about canonical URLs on our help page.", "wordpress-seo" ) }
	/>;
};


/**
 * Class that renders the Advanced Settings tab.
 */
class AdvancedSettings extends Component {
	/**
	 * Returns all the fields that should be in the Advanced Settings tab based on global settings.
	 *
	 * @returns {Component} The Advanced settings tab.
	 */
	render() {
		return (
			<MetaboxCollapsible id={ "collapsible-advanced-settings" } title={ __( "Advanced", "wordpress-seo" ) }>
				<MetaRobotsNoIndex />
				{ isPost() && <MetaRobotsNoFollow /> }
				{ isPost() && <MetaRobotsAdvanced /> }
				{
					! window.wpseoAdminL10n.breadcrumbsDisabled && <BreadCrumbsTitle />
				}
				<CanonicalURL />
			</MetaboxCollapsible>
		);
	}
}

export default AdvancedSettings;
