/* globals wpseoAdminL10n */
import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { utils } from "yoast-components";

import Collapsible from "./SidebarCollapsible";
import CornerstoneToggle from "yoast-components/composites/Plugin/CornerstoneContent/components/CornerstoneToggle";

/**
 * Renders the collapsible cornerstone toggle.
 *
 * @returns {ReactElement} The collapsible cornerstone toggle component.
 * @constructor
 */
export default function CollapsibleCornerstone( { isCornerstone, onChange } ) {
	const { makeOutboundLink } = utils;
	const LearnMoreLink = makeOutboundLink();

	return (
		<Collapsible title={ __( "Cornerstone content", "wordpress-seo" ) }>
			<p>{ __( "Cornerstone content should be the most important and extensive articles on your site. ", "wordpress-seo" ) }
				<LearnMoreLink href={ wpseoAdminL10n[ "shortlinks.cornerstone_content_info" ] } rel={ null }>
					{ __( "Learn more about Cornerstone Content.", "wordpress-seo" ) }
				</LearnMoreLink>
			</p>
			<CornerstoneToggle
				isEnabled={ isCornerstone }
				onToggle={ onChange }
			/>
		</Collapsible>
	);
}

CollapsibleCornerstone.propTypes = {
	isCornerstone: PropTypes.bool,
	onChange: PropTypes.func,
};
