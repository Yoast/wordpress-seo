import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Button } from "@yoast/components";

/**
 * Renders a button to finish a workout step.
 *
 * @param {function} onClick The onclick callback.
 * @param {boolean} isFinished If the step is finished or not.
 * @returns {wp.Element} The finish button.
 * @constructor
 */
export default function FinishButton( { onClick, isFinished } ) {
	const copy = isFinished ? __( "Revise this step", "wordpress-seo-premium" ) : __( "I've finished this step", "wordpress-seo-premium" );

	return <Button onClick={ onClick }>{ copy }</Button>;
}

FinishButton.propTypes = {
	isFinished: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
};
