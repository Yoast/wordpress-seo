/* External dependencies */
import { __, _n, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * Tries to parse a string to an int and returns a default if it does not produce a valid number.
 *
 * @param {string} string           String to parse to an integer.
 * @param {number} [defaultInteger] Default value if the parse does not return a valid number.
 *
 * @returns {number} The parsed number or default.
 */
function parseIntDefault( string, defaultInteger = 0 ) {
	return parseInt( string, 10 ) || defaultInteger;
}

/**
 * Transforms the durations into a translated string containing the count, and either singular or plural unit.
 *
 * For example (in en-US): If durations.days is 1, it returns "1 day". If durations.days is 2, it returns "2 days".
 *
 * @param {Object} durations         The duration values.
 * @param {number} durations.days    Number of days.
 * @param {number} durations.hours   Number of hours.
 * @param {number} durations.minutes Number of minutes.
 *
 * @returns {Array} Array of pluralized durations.
 */
function transformDurationsToStrings( { days, hours, minutes } ) {
	const strings = [];
	if ( days !== 0 ) {
		strings.push( sprintf( _n( "%d day", "%d days", days, "wordpress-seo" ), days ) );
	}
	if ( hours !== 0 ) {
		strings.push( sprintf( _n( "%d hour", "%d hours", hours, "wordpress-seo" ), hours ) );
	}
	if ( minutes !== 0 ) {
		strings.push( sprintf( _n( "%d minute", "%d minutes", minutes, "wordpress-seo" ), minutes ) );
	}
	return strings;
}

/**
 * Formats the durations into a translated string.
 *
 * @param {Object} durations         The duration values.
 * @param {string} durations.days    Number of days.
 * @param {string} durations.hours   Number of hours.
 * @param {string} durations.minutes Number of minutes.
 *
 * @returns {string} Formatted duration.
 */
function buildDurationString( durations ) {
	const elements = transformDurationsToStrings( {
		days: parseIntDefault( durations.days ),
		hours: parseIntDefault( durations.hours ),
		minutes: parseIntDefault( durations.minutes ),
	} );

	if ( elements.length === 1 ) {
		return elements[ 0 ];
	}
	if ( elements.length === 2 ) {
		return sprintf(
			/* Translators: %s expands to a unit of time (e.g. 1 day) */
			__( "%s and %s", "wordpress-seo" ),
			...elements,
		);
	}
	if ( elements.length === 3 ) {
		return sprintf(
			/* Translators: %s expands to a unit of time (e.g. 1 day) */
			__( "%s, %s and %s", "wordpress-seo" ),
			...elements,
		);
	}
	return "";
}

/**
 * Returns the component of the given How-to step to be rendered in a WordPress post
 * (e.g. not in the editor).
 *
 * @param {object} step The how-to step.
 *
 * @returns {Component} The component to be rendered.
 */
const LegacyHowToStep = ( step ) => {
	return (
		<li className={ "schema-how-to-step" } key={ step.id } >
			<strong
				className="schema-how-to-step-name"
				key={ step.id + "-name" } >
				{ step.name }
			</strong>
			{ " " }
			<p
				className="schema-how-to-step-text"
				key={ step.id + "-text" } >
				{ step.text }
			</p>
			{ " " }
		</li>
	);
};

/**
 * Returns the component to be used to render
 * the How-to block on Wordpress (e.g. not in the editor).
 *
 * @param {object} props the attributes of the How-to block.
 *
 * @returns {Component} The component representing a How-to block.
 */
export default function LegacyHowTo( props ) {
	let {
		steps,
		hasDuration,
		days,
		hours,
		minutes,
		description,
		unorderedList,
		additionalListCssClasses,
		className,
	} = props.attributes;

	steps = steps
		? steps.map( ( step ) => {
			return(
				<LegacyHowToStep
					{ ...step }
					key={ step.id }
				/>
			);
		} )
		: null;

	const classNames       = [ "schema-how-to", className ].filter( ( item ) => item ).join( " " );
	const listClassNames   = [ "schema-how-to-steps", additionalListCssClasses ].filter( ( item ) => item ).join( " " );

	const timeString = buildDurationString( { days, hours, minutes } );

	return (
		<div className={ classNames }>
			{ ( hasDuration && typeof timeString === "string" && timeString.length > 0 ) &&
				<p className="schema-how-to-total-time">
					{ __( "Time needed:", "wordpress-seo" ) }
					&nbsp;
					{ timeString + ". " }
				</p>
			}
			<p className="schema-how-to-description">
				{ description }
			</p>
			{ " " }
			{ unorderedList
				? <ul className={ listClassNames }>{ steps }</ul>
				: <ol className={ listClassNames }>{ steps }</ol>
			}
		</div>
	);
}

LegacyHowTo.propTypes = {
	attributes: PropTypes.object,
};
