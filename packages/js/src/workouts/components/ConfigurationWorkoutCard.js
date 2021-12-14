// External dependencies.
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
// Internal dependencies.
import WorkoutCard from "./WorkoutCard";
import { ReactComponent as ConfigurationImageBubble } from "../../../../../images/mirrored_fit_bubble_woman_1_optim.svg";
import ConfigurationWorkout from "./ConfigurationWorkout";
import { FINISHABLE_STEPS } from "../config";

/**
 * The ConfigurationWorkoutCard component.
 *
 * @param {Object} props The props object.
 *
 * @returns {WPElement} The ConfigurationWorkoutCard component.
 */
export default function ConfigurationWorkoutCard( {
	badges,
} ) {
	const finishedSteps = useSelect( select => select( "yoast-seo/workouts" ).getFinishedSteps( "configuration" ) );
	return <WorkoutCard
		name={ "configuration" }
		title={ __( "Configuration", "wordpress-seo" ) }
		// translators: %s translates to Yoast SEO.
		subtitle={ sprintf( __( "Configure %s", "wordpress-seo" ), "Yoast SEO" ) }
		usps={ [
			sprintf( __(
				"Configure %s in a few steps",
				"wordpress-seo"
			), "Yoast SEO" ),
			__(
				"Apply the optimal SEO settings to your site",
				"wordpress-seo"
			),
		] }
		image={ ConfigurationImageBubble }
		finishableSteps={ FINISHABLE_STEPS.configuration }
		finishedSteps={ finishedSteps }
		upsell={ null }
		workout={ ConfigurationWorkout }
		badges={ badges }
	/>;
}

ConfigurationWorkoutCard.propTypes = {
	badges: PropTypes.arrayOf( PropTypes.element ),
};

ConfigurationWorkoutCard.defaultProps = {
	badges: [],
};
