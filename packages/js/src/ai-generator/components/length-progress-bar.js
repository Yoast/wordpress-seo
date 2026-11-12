import { useMemo } from "@wordpress/element";
import { ProgressBar } from "@yoast/ui-library";
import classNames from "classnames";

/**
 * @param {number} score The score.
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
 * @param {Object} props Component props.
 * @param {string} [props.className=""] Extra className.
 * @param {number} props.progress The current progress.
 * @param {number} props.max The maximum progress.
 * @param {number} props.score The length assessment score; used to determine the color.
 *
 * @returns {JSX.Element} The element.
 */
export const LengthProgressBar = ( { className = "", progress, max, score } ) => {
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
