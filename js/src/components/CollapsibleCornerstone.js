import React from "react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

import Collapsible from "./SidebarCollapsible";
import CornerstoneToggle from "yoast-components/composites/Plugin/CornerstoneContent/components/CornerstoneToggle";

/**
 * Renders the collapsible cornerstone toggle.
 *
 * @returns {ReactElement} The collapsible cornerstone toggle component.
 * @constructor
 */
export default function CollapsibleCornerstone( { isCornerstone, onChange } ) {
	return (
		<Collapsible title="Cornerstone content">
			<p> { __( "Cornerstone content should be the most important and extensive articles on your site. ", "wordpress-seo" ) }
				<a href='https://yoa.st/1i9' target="_blank"> { __( "Learn more about cornerstone content.", "wordpress-seo" ) } </a>
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
