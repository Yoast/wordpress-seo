import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import { isNumber } from "lodash";
import PropTypes from "prop-types";

/**
 * Interpreters a score and gives it a particular rating.
 *
 * @param {number} score The score to interpreter.
 *
 * @returns {string} The rating, given based on the score.
 */
export function scoreToRating( score ) {
	if ( score === -1 ) {
		return "noindex";
	}

	if ( score === 0 ) {
		return "na";
	}

	if ( ( score < -1 ) || ( score > 100 ) ) {
		return "";
	}

	if ( score <= 40 ) {
		return "bad";
	}

	if ( score <= 70 ) {
		return "ok";
	}

	return "good";
}

/**
 * Gets a score indicator for a given score.
 *
 * @param {string|null} score The score.
 *
 * @returns {Object} The score indicator props for the given score.
 */
export function getIndicatorForRating( score ) {
	switch ( score ) {
		case "feedback":
			return {
				colorClassName: "yst-bg-gray-400",
				screenReaderText: __( "Feedback", "admin-ui" ),
				screenReaderReadabilityText: "",
			};
		case "bad":
			return {
				colorClassName: "yst-bg-red-500",
				screenReaderText: __( "Needs improvement", "admin-ui" ),
				screenReaderReadabilityText: __( "Needs improvement", "admin-ui" ),
			};
		case "ok":
			return {
				colorClassName: "yst-bg-yellow-400",
				screenReaderText: __( "OK SEO score", "admin-ui" ),
				screenReaderReadabilityText: __( "OK", "admin-ui" ),
			};
		case "good":
			return {
				colorClassName: "yst-bg-green-400",
				screenReaderText: __( "Good SEO score", "admin-ui" ),
				screenReaderReadabilityText: __( "Good", "admin-ui" ),
			};
		default:
			return {
				colorClassName: "yst-bg-gray-400",
				screenReaderText: "",
				screenReaderReadabilityText: "",
			};
	}
}

/**
 * Gets the appropriate screenreader text based on the entity of the indicator.
 *
 * @param {string} entity The entity of the indicator.
 * @param {Object} scoreOutput The object with all the data belonging to the current score.
 *
 * @returns {string} The appropriate screenreader text.
 */
function getScreenreaderText( entity, scoreOutput ) {
	switch ( entity ) {
		case "seoScore":
			return scoreOutput.screenReaderText;
		case "readabilityScore":
			return scoreOutput.screenReaderReadabilityText;
		default:
			return "";
	}
}

/**
 * The ScoreIndicator component.
 * @param {Object} props Props object.
 * @param {string} props.className Additional CSS class names.
 * @param {string} props.entity Whether the indicator is for the SEO-score, or the Readability analysis.
 * @param {string} props.score The human-readable score, options are "bad", "ok", "good" and "feedback". All other strings are interpreted as NA.
 * @param {string|number|null} props.score Either a number or a human-readable score, options are "bad", "ok", "good" and "feedback".
 * @returns {JSX.Element} The ScoreIndicator component.
 */
export default function ScoreIndicator( { className, entity, score } ) {
	const scoreOutput = getIndicatorForRating( isNumber( score ) ? scoreToRating( score ) : score );
	const screenReaderText = getScreenreaderText( entity, scoreOutput );

	return (
		<>
			<span
				aria-hidden="true"
				className={ classNames(
					"yst-block yst-w-3 yst-h-3 yst-rounded-full yst-mx-auto",
					scoreOutput.colorClassName,
					className,
				) }
			/>
			<span className="yst-sr-only">
				{ screenReaderText }
			</span>
		</>
	);
}

ScoreIndicator.propTypes = {
	className: PropTypes.string,
	entity: PropTypes.oneOf( [ "seoScore", "readabilityScore" ] ).isRequired,
	score: PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ),
};

ScoreIndicator.defaultProps = {
	className: "",
	score: "",
};
