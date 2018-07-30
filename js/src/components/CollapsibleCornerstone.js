import React from "react";
import PropTypes from "prop-types";

import { Collapsible } from "yoast-components";
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
			<p>Cornerstone content should be the most important and extensive articles on your site.</p>
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
