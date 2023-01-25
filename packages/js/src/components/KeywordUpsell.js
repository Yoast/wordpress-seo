/* global wpseoAdminL10n */
import { LocationConsumer } from "@yoast/externals/contexts";
import { colors } from "@yoast/style-guide";
import { __ } from "@wordpress/i18n";
import MetaboxCollapsible from "./MetaboxCollapsible";
import MultipleKeywords from "./modals/MultipleKeywords";
import SidebarCollapsible from "./SidebarCollapsible";

/**
 * Renders the UpsellBox component.
 *
 * @returns {wp.Element} The UpsellBox component.
 */
const KeywordUpsell = () => {
	return (
		<LocationConsumer>
			{ location => {
				// Default to metabox.
				let link = wpseoAdminL10n[ "shortlinks.upsell.metabox.additional_link" ];
				let buyLink = wpseoAdminL10n[ "shortlinks.upsell.metabox.additional_button" ];
				let Collapsible = MetaboxCollapsible;

				if ( location.toLowerCase() === "sidebar" ) {
					link = wpseoAdminL10n[ "shortlinks.upsell.sidebar.additional_link" ];
					buyLink = wpseoAdminL10n[ "shortlinks.upsell.sidebar.additional_button" ];
					Collapsible = SidebarCollapsible;
				}

				return (
					<Collapsible
						prefixIcon={ { icon: "plus", color: colors.$color_grey_medium_dark } }
						prefixIconCollapsed={ { icon: "plus", color: colors.$color_grey_medium_dark } }
						title={ __( "Add related keyphrase", "wordpress-seo" ) }
						id={ `yoast-additional-keyphrase-collapsible-${ location }` }
					>
						<MultipleKeywords
							link={ link }
							buyLink={ buyLink }
						/>
					</Collapsible>
				);
			} }
		</LocationConsumer>
	);
};

export default KeywordUpsell;
