import React from "react";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { utils } from "yoast-components";

import Collapsible from "./SidebarCollapsible";
import CornerstoneToggle from "yoast-components/composites/Plugin/CornerstoneContent/components/CornerstoneToggle";

/**
 * Renders the collapsible cornerstone toggle.
 *
 * @returns {ReactElement} The collapsible cornerstone toggle component.
 * @constructor
 */
export default function CollapsibleCornerstone( { isCornerstone, onChange, postTypeName } ) {
	const { makeOutboundLink } = utils;
	const LearnMoreLink = makeOutboundLink();

	return (
		<Collapsible title={ __( "Cornerstone content", "wordpress-seo" ) }>
			<p>{ sprintf(
				__( "Mark the most important %1$s as 'cornerstone content' to improve your site structure.", "wordpress-seo" ),
				postTypeName.toLowerCase()
			) } <LearnMoreLink href={ "https://yoa.st/1i9" } rel={ null }>
					{ __( "Learn more about cornerstone content.", "wordpress-seo" ) }
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
	postTypeName: PropTypes.string,
};
