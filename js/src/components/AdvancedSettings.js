import Collapsible from "./SidebarCollapsible";
import { __, sprintf } from "@wordpress/i18n";
import { MultipleSelect, SingleSelect } from "./Select2";
import { Component } from "@wordpress/element";
import CollapsibleHelpText from "./CollapsibleHelpText";
import Input from "./Input";
import { Fragment } from "react";
import RadioButtons from "./RadioButtons";
import { Alert } from "@yoast/components";

// Define where the data comes from. This makes it easier to change the data object in the future.
const dataObject = window.wpseoAdminL10n;

/**
 * Functional component for the Meta Robots No-Index option.
 *
 * @returns {Component} The Meta Robots No-Index component.
 */
const MetaRobotsNoIndex = () => {
	const hiddenInputId = isPost() ? "#yoast_wpseo_meta-robots-noindex" : "#hidden_wpseo_noindex";
	const noIndex = dataObject.noIndex ? "No" : "Yes";
	return <Fragment>
		{
			dataObject.privateBlog &&
			<Alert type="warning">
				{ __( 'Even though you can set the meta robots setting here, the entire site is set to noindex in the sitewide privacy settings, so these settings won\'t have an effect.', 'wordpress-seo' ) }
			</Alert>
		}
		<label htmlFor="yoast_wpseo_meta-robots-noindex-react">
			{
				sprintf(
					__( "Allow search engines to show this %s in search results?", "wordpress-seo" ),
					dataObject.labelSingular,
				)
			}
		</label>
		<SingleSelect
			componentId={ "yoast_wpseo_meta-robots-noindex-react" }
			hiddenInputId={ hiddenInputId }
			options={ [
				{
					name: sprintf(
						__( "Default for %s, currently: %s", "wordpress-seo" ),
						dataObject.label,
						noIndex,
					),
					value: "0",
				},
				{ name: __( "Yes", "wordpress-seo" ), value: "1" },
				{ name: __( "No", "wordpress-seo" ), value: "2" },
			] }
		/>
	</Fragment>;
};

/**
 * Functional component for the Meta Robots No-Follow option.
 *
 * @returns {Component} The Meta Robots No-Follow option.
 */
const MetaRobotsNoFollow = () => {
	return <Fragment>
		<label htmlFor="yoast_wpseo_meta-robots-nofollow-react">
			{
				sprintf(
					__( "Should search engines follow links on this %s", "wordpress-seo" ),
					dataObject.labelSingular,
				)
			}
		</label>
		<RadioButtons
			componentId="yoast_wpseo_meta-robots-nofollow-react"
			hiddenComponentId="#yoast_wpseo_meta-robots-nofollow"
			numberOfButtons={ 2 }
			options={ [ "Yes", "No" ] }
		/>
	</Fragment>;
};

/**
 * Functional component for the Meta Robots Advanced field.
 *
 * @returns {Component} The Meta Robots advanced field component.
 */
const MetaRobotsAdvanced = () => {
	return <Fragment>
		<CollapsibleHelpText
			label={ __( "Meta robots advanced", "wordpress-seo" ) }
			helpText={
				sprintf(
					__( "If you want to apply advanced %1$smeta%2$s robots settings for this page, please define them in the following field.",
						"wordpress-seo",
					),
					"<code>",
					"</code>",
				)
			}
		/>
		<MultipleSelect
			componentId={ "yoast_wpseo_meta-robots-adv-react" }
			hiddenInputId={ "#yoast_wpseo_meta-robots-adv" }
			options={ [
				{ name: __( "No Image Index", "wordpress-seo" ), value: "noimageindex" },
				{ name: __( "No Archive", "wordpress-seo" ), value: "noarchive" },
				{ name: __( "No Snippet", "wordpress-seo" ), value: "nosnippet" },
			] }
			default=""
		/>
	</Fragment>;
};

/**
 * Functional component for the Breadcrumbs Title.
 *
 * @returns {Component} The Breadcrumbs title component.
 */
const BreadCrumbsTitle = () => {
	const hiddenInputId = isPost() ? "#yoast_wpseo_bctitle" : "#hidden_wpseo_bctitle";

	return <Fragment>
		<CollapsibleHelpText
			label={ __( "Breadcrumbs Title", "wordpress-seo" ) }
			helpText={ __( "Title to use for this page in breadcrumb paths", "wordpress-seo" ) }
		/>
		<Input
			componentId="yoast_wpseo_bctitle-react"
			hiddenInputId={ hiddenInputId }
		/>
	</Fragment>;
};

/**
 * Functional component for the Canonical URL.
 *
 * @returns {Component} The canonical URL component.
 */
const CanonicalURL = () => {
	/**
	 * Returns a span with a message that the link will open in a new tab.
	 *
	 * @returns {string} The span.
	 */
	const getNewTabMessage = () => {
		return sprintf(
			"<span class=\"screen-reader-text\">%s</span>",
			__( "(Opens in a new browser tab)", "wordpress-seo" ),
		);
	};

	/**
	 * Gets the canonical URL helptext.
	 */
	const canonicalDescription = sprintf(
		__(
			"The canonical URL that this page should point to. Leave empty to default to permalink. %1$sCross domain canonical%2$s supported too.",
			"wordpress-seo",
		),
		"<a href=\"https://googlewebmastercentral.blogspot.com/2009/12/handling-legitimate-cross-domain.html\" target=\"_blank\" rel=\"noopener\">",
		getNewTabMessage() + "</a>",
	);

	const hiddenInputId = isPost() ? "#yoast_wpseo_canonical" : "#hidden_wpseo_canonical";

	return <Fragment>
		<CollapsibleHelpText
			label={ __( "Canonical URL", "wordpress-seo" ) }
			helpText={ canonicalDescription }
		/>
		<Input
			componentId="yoast_wpseo_canonical-react"
			hiddenInputId={ hiddenInputId }
		/>
	</Fragment>;
};

/**
 * Helper function to check whether the current object refers to a post or a taxonomy.
 *
 * @return {boolean} true if post, false if taxonomy.
 */
const isPost = () => {
	return dataObject.postType === "post";
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
			<Collapsible id={ "yoast-cornerstone-collapsible" } title={ __( "Advanced", "wordpress-seo" ) }>
				<MetaRobotsNoIndex />
				{ isPost() && <MetaRobotsNoFollow/> }
				{ isPost() && <MetaRobotsAdvanced /> }
				{
					! dataObject.breadcrumbsDisabled && <BreadCrumbsTitle />
				}
				<CanonicalURL />
			</Collapsible>
		);
	}
}

export default AdvancedSettings;
