/* External dependencies */
import { createPortal } from "@wordpress/element";
import { SvgIcon } from "@yoast/components";
import PropTypes from "prop-types";

/* Internal dependencies */
import { getIconForScore } from "./mapResults";

/**
 * Renders a score icon in a specified dom element.
 *
 * @param {Object} props The component's props.
 *
 * @returns {React.Element} The score element.
 */
const ScoreIconPortal = ( { elementId, scoreIndicator } ) => {
	const element = document.getElementById( elementId );

	if ( ! element ) {
		return null;
	}

	return createPortal( <SvgIcon { ...getIconForScore( scoreIndicator ) } />, element );
};

ScoreIconPortal.propTypes = {
	elementId: PropTypes.string.isRequired,
	scoreIndicator: PropTypes.string.isRequired,
};

export default ScoreIconPortal;
