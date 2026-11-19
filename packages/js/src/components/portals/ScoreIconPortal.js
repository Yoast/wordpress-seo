/* External dependencies */
import { SvgIcon } from "@yoast/components";

/* Internal dependencies */
import { getIconForScore } from "../contentAnalysis/mapResults";
import Portal from "./Portal";

/**
 * Renders a score icon in a specified dom element.
 *
 * @param {Object} props Component props.
 * @param {string} props.target A target element ID in which to render the portal.
 * @param {string} props.scoreIndicator The score indicator.
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

export default ScoreIconPortal;
