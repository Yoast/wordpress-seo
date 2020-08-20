/* globals wpseoAdminL10n */
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

import { HelpText } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";
import SidebarCollapsible from "./SidebarCollapsible";
import MetaboxCollapsible from "./MetaboxCollapsible";
import { default as CornerstoneToggle } from "./CornerstoneToggle";
import { LocationConsumer } from "./contexts/location";
const LearnMoreLink = makeOutboundLink();

/**
 * Renders the collapsible cornerstone toggle.
 *
 * @returns {wp.Element} The collapsible cornerstone toggle component.
 * @constructor
 */
export default function CollapsibleCornerstone( { isCornerstone, onChange } ) {
	return (
		<LocationConsumer>
			{ location => {
				const Collapsible = location === "metabox" ? MetaboxCollapsible : SidebarCollapsible;
				return (
					<Collapsible id={ `yoast-cornerstone-collapsible-${ location }` } title={ __( "Cornerstone content", "wordpress-seo" ) }>
						<HelpText>
							{ __( "Cornerstone content should be the most important and extensive articles on your site.", "wordpress-seo" ) + " " }
							<LearnMoreLink href={ wpseoAdminL10n[ "shortlinks.cornerstone_content_info" ] }>
								{ __( "Learn more about Cornerstone Content.", "wordpress-seo" ) }
							</LearnMoreLink>
						</HelpText>
						<CornerstoneToggle
							isEnabled={ isCornerstone }
							onToggle={ onChange }
						/>
					</Collapsible>
				);
			} }
		</LocationConsumer>
	);
}

CollapsibleCornerstone.propTypes = {
	isCornerstone: PropTypes.bool,
	onChange: PropTypes.func,
};
CollapsibleCornerstone.defaultProps = {
	isCornerstone: true,
	onChange: () => {},
};
