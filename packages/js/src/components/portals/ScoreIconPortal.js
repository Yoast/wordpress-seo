/* External dependencies */
import { SvgIcon } from "@yoast/components";
import PropTypes from "prop-types";

/* Internal dependencies */
import { getIconForScore } from "../contentAnalysis/mapResults";
import Portal from "./Portal";

/**
 * Renders a score icon in a specified dom element.
 *
 * @param {string} target A target element ID in which to render the portal.
 * @param {string} scoreIndicator The score indicator.
 *
 * @returns {wp.Element} The score element.
 */
const ScoreIconPortal = ( { target, scoreIndicator } ) => {
	return (
		<Portal target={ target }>
			<SvgIcon { ...getIconForScore( scoreIndicator ) } />
		</Portal>
	);
};

ScoreIconPortal.propTypes = {
	target: PropTypes.string.isRequired,
	scoreIndicator: PropTypes.string.isRequired,
};

export default ScoreIconPortal;
