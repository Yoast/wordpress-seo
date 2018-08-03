import React from "react";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";

import { Collapsible } from "yoast-components";
import { CornerstoneToggle } from "yoast-components";

/**
 * Renders the collapsible cornerstone toggle.
 *
 * @returns {ReactElement} The collapsible cornerstone toggle component.
 * @constructor
 */
export default function CollapsibleCornerstone( { isCornerstone, onChange, postTypeName } ) {
	return (
		<Collapsible title="Cornerstone content">
			<p> { sprintf(
				__( "Mark the most important %1$s as 'cornerstone content' to improve your site structure. ", "wordpress-seo" ),
				postTypeName.toLowerCase()
			) }
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
	postTypeName: PropTypes.string,
};
