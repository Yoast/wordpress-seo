// External dependencies.
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
// Internal dependencies.
import WorkoutCard from "./WorkoutCard";
import { ReactComponent as CornerstoneImageBubble } from "../../../../../images/mirrored_fit_bubble_man_1_optim.svg";
import { WORKOUTS, FINISHABLE_STEPS } from "../config";

/**
 * The CornerstoneWorkoutCard component.
 *
 * @param {Object} props The props object.
 *
 * @returns {WPElement} The CornerstoneWorkoutCard component.
 */
export default function CornerstoneWorkoutCard( {
	workout,
	badges,
	upsellLink,
	upsellText,
} ) {
	const finishedSteps = useSelect( select => select( "yoast-seo/workouts" ).getFinishedSteps( WORKOUTS.cornerstone ) );
	const finishedWorkouts = useSelect( select => select( "yoast-seo/workouts" ).getFinishedWorkouts() );
	const isConfigurationWorkoutFinished = finishedWorkouts.includes( WORKOUTS.configuration );
	const actualUpsellLink = upsellLink ? upsellLink :  "https://yoa.st/workout-cornerstone-upsell";

	return <WorkoutCard
		id={ "cornerstone-workout-card" }
		name={ WORKOUTS.cornerstone }
		title={ __( "The cornerstone approach", "wordpress-seo" ) }
		subtitle={ __( "Rank with articles you want to rank with", "wordpress-seo" ) }
		usps={ [
			__( "Make your important articles rank higher", "wordpress-seo" ),
			__( "Bring more visitors to your articles", "wordpress-seo" ),
		] }
		image={ CornerstoneImageBubble }
		finishableSteps={ FINISHABLE_STEPS.cornerstone }
		finishedSteps={ finishedSteps }
		upsellLink={ actualUpsellLink }
		upsellText={ upsellText }
		workout={ workout }
		badges={ badges }
		blocked={ ! isConfigurationWorkoutFinished && ( window.wpseoWorkoutsData.canDoConfigurationWorkout === "1" ) }
	/>;
}

CornerstoneWorkoutCard.propTypes = {
	workout: PropTypes.func,
	badges: PropTypes.arrayOf( PropTypes.element ),
	upsellLink: PropTypes.string,
	upsellText: PropTypes.string,
};

CornerstoneWorkoutCard.defaultProps = {
	workout: null,
	badges: [],
	upsellLink: null,
	upsellText: null,
};
