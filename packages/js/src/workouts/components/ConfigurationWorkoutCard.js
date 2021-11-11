// External dependencies.
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
// Internal dependencies.
import WorkoutCard from "./WorkoutCard";
import ConfigurationWorkout from "./ConfigurationWorkout";

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
	const finishedSteps = useSelect( "yoast-seo/workouts" ).getFinishedSteps( "configuration" );
	return <WorkoutCard
		name={ "configuration" }
		title={ __( "Configuration", "wordpress-seo" ) }
		// translators: %s translates to Yoast SEO.
		subtitle={ sprintf( __( "Configure %s with the optimal SEO settings for your site", "wordpress-seo" ), "Yoast SEO" ) }
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
		finishableSteps={ [ "step1", "step2", "step3", "step4", "step5" ] }
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
