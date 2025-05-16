import { useMemo } from "@wordpress/element";
import { ProgressBar } from "@yoast/ui-library";
import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {Number} score The score.
 * @returns {string} The class.
 */
const transformScoreToClass = ( score ) => {
	if ( score >= 7 ) {
		return "yst-score-good";
	}
	if ( score >= 5 ) {
		return "yst-score-ok";
	}
	return "yst-score-bad";
};

/**
 * @param {string} [className] Extra className.
 * @param {Number} progress The current progress.
 * @param {Number} max The maximum progress.
 * @param {Number} score The length assessment score; used to determine the color.
 * @returns {JSX.Element} The element.
 */
export const LengthProgressBar = ( { className, progress, max, score } ) => {
	const colorClass = useMemo( () => transformScoreToClass( score ), [ score ] );

	return (
		<ProgressBar
			className={ classNames( "yst-length-progress-bar", colorClass, className ) }
			progress={ progress }
			min={ 0 }
			max={ max }
		/>
	);
};

LengthProgressBar.propTypes = {
	className: PropTypes.string,
	progress: PropTypes.number.isRequired,
	max: PropTypes.number.isRequired,
	score: PropTypes.number.isRequired,
};

LengthProgressBar.defaultProps = {
	className: "",
};
