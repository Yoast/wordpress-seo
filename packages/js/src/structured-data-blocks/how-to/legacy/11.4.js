/* External dependencies */
import PropTypes from "prop-types";

/* Internal dependencies */
import buildDurationString from "./utils/8.2";

/**
 * This migration is necessary because the HTML markup changed, because in 11.4 an id
 * was added to the step content.
 *
 * See https://github.com/Yoast/wordpress-seo/pull/13027.
 */

/**
 * Returns the component of the given How-to step to be rendered in a WordPress post
 * (e.g. not in the editor).
 *
 * @param {Object} step The how-to step.
 *
 * @returns {wp.Element} The component to be rendered.
 */
function LegacyHowToStep( step ) {
	return (
		<li className="schema-how-to-step" key={ step.id }>
			<strong
				className="schema-how-to-step-name"
				key={ step.id + "-name" }
			>
				{ step.name }
			</strong>
			{ " " }
			<p
				className="schema-how-to-step-text"
				key={ step.id + "-text" }
			>
				{ step.text }
			</p>
			{ " " }
		</li>
	);
}

/**
 * Returns the component to be used to render
 * the How-to block on WordPress (e.g. not in the editor).
 *
 * @param {Object} props the attributes of the How-to block.
 *
 * @returns {wp.Element} The component representing a How-to block.
 */
export default function LegacyHowTo( props ) { // eslint-disable-line complexity
	const {
		steps,
		hasDuration,
		days,
		hours,
		minutes,
		description,
		unorderedList,
		additionalListCssClasses,
		className,
		durationText,
		defaultDurationText,
	} = props.attributes;

	const classNames     = [ "schema-how-to", className ].filter( ( item ) => item ).join( " " );
	const listClassNames = [ "schema-how-to-steps", additionalListCssClasses ].filter( ( item ) => item ).join( " " );

	const timeString = buildDurationString( { days, hours, minutes } );

	let stepElements = [];
	if ( steps ) {
		stepElements = steps.map( step => {
			return <LegacyHowToStep { ...step } key={ step.id } />;
		} );
	}

	return (
		<div className={ classNames }>
			{ ( hasDuration && typeof timeString === "string" && timeString.length > 0 ) &&
				<p className="schema-how-to-total-time">
					<span className="schema-how-to-duration-time-text">
						{ durationText || defaultDurationText }
						&nbsp;
					</span>
					{ timeString + ". " }
				</p>
			}
			<p className="schema-how-to-description">
				{ description }
			</p>
			{ " " }
			{ unorderedList
				? <ul className={ listClassNames }>{ stepElements }</ul>
				: <ol className={ listClassNames }>{ stepElements }</ol>
			}
		</div>
	);
}

LegacyHowTo.propTypes = {
	attributes: PropTypes.object.isRequired,
};
