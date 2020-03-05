import Collapsible from "./SidebarCollapsible";
import { __, sprintf } from "@wordpress/i18n";
import { MultipleSelect, SingleSelect } from "./Select2";
import { Component } from "@wordpress/element";
import CollapsibleHelpText from "./CollapsibleHelpText";
import Input from "./Input";
import { Fragment } from "react";
import { RadioButton, RadioButtonGroup } from "material-ui";
import RadioButtons from "./RadioButtons";

class AdvancedSettings extends Component {
	get_new_tab_message() {
		return sprintf(
			"<span class=\"screen-reader-text\">%s</span>",
			__( "(Opens in a new browser tab)", "wordpress-seo" ),
		);
	};

	render() {
		const noIndex = wpseoPostScraperL10n.noIndex ? "No" : "Yes";
		const canonicalDescription = sprintf(
			__( "The canonical URL that this page should point to. Leave empty to default to permalink. %1$sCross domain canonical%2$s supported too.", "wordpress-seo" ),
			"<a href=\"https://googlewebmastercentral.blogspot.com/2009/12/handling-legitimate-cross-domain.html\" target=\"_blank\" rel=\"noopener\">",
			this.get_new_tab_message() + "</a>",
		);
		return (
			<Collapsible id={ "yoast-cornerstone-collapsible" } title={ __( "Advanced", "wordpress-seo" ) }>
				<label>{ sprintf( __( "Allow search engines to show this Post in search results?", "wordpress-seo" ), wpseoPostScraperL10n.postLabel ) }</label>
				<SingleSelect
					componentId={ "yoast_wpseo_meta-robots-noindex-react" }
					hiddenInputId={ "#yoast_wpseo_meta-robots-noindex" }
					options={ [
						{
							name: sprintf(
								__( "Default for Posts, currently: %s", "wordpress-seo" ),
								noIndex,
							),
							value: "0",
						},
						{ name: __( "Yes", "wordpress-seo" ), value: "1" },
						{ name: __( "No", "wordpress-seo" ), value: "2" },
					] }
				/>
				<label>{ __( "Should search engines follow links on this Post", "wordpress-seo" ) }</label>
				<RadioButtons
					componentId="yoast_wpseo_meta-robots-nofollow-react"
					hiddenComponentId="#yoast_wpseo_meta-robots-nofollow"
					numberOfButtons={ 2 }
					options={ [ "Yes", "No" ] }
				/>
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
				/>
				{
					! wpseoPostScraperL10n.breadcrumbsDisabled &&
					<Fragment>
						<CollapsibleHelpText
							label={ __( "Breadcrumbs Title", "wordpress-seo" ) }
							helpText={ __( "Title to use for this page in breadcrumb paths", "wordpress-seo" ) }
						/>
						<Input
							componentId="yoast_wpseo_bctitle-react"
							hiddenInputId="#yoast_wpseo_bctitle"
						/>
					</Fragment>
				}
				<CollapsibleHelpText
					label={ __( "Canonical URL", "wordpress-seo" ) }
					helpText={ canonicalDescription }
				/>
				<Input
					componentId="yoast_wpseo_canonical-react"
					hiddenInputId="#yoast_wpseo_canonical"
				/>
			</Collapsible>
		);
	}
}

export default AdvancedSettings;
