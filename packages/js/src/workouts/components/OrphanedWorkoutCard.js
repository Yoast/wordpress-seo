// External dependencies.
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
// Internal dependencies.
import WorkoutCard from "./WorkoutCard";
import { ReactComponent as OrphanedImageBubble } from "../../../../../images/mirrored_fit_bubble_woman_2_optim.svg";
import { FINISHABLE_STEPS, WORKOUTS } from "../config";

/**
 * The CornerstoneWorkoutCard component.
 *
 * @param {Object} props The props object.
 *
 * @returns {WPElement} The CornerstoneWorkoutCard component.
 */
export default function OrphanedWorkoutCard( {
	workout,
	badges,
} ) {
	const finishedSteps = useSelect( select => select( "yoast-seo/workouts" ).getFinishedSteps( WORKOUTS.orphaned ) );
	return <WorkoutCard
		name={ WORKOUTS.orphaned }
		title={ __( "Orphaned content", "wordpress-seo" ) }
		subtitle={ __( "Clean up your unlinked content to make sure people can find it", "wordpress-seo" ) }
		usps={ [
			__( "Make pages easier for Google and visitors to find", "wordpress-seo" ),
			__( "Add internal links to your posts and pages", "wordpress-seo" ),
		] }
		image={ OrphanedImageBubble }
		finishableSteps={ FINISHABLE_STEPS.orphaned }
		finishedSteps={ finishedSteps }
		upsellLink={ "https://yoa.st/workout-orphaned-content-upsell" }
		workout={ workout }
		badges={ badges }
	/>;
}

OrphanedWorkoutCard.propTypes = {
	workout: PropTypes.func,
	badges: PropTypes.arrayOf( PropTypes.element ),
};

OrphanedWorkoutCard.defaultProps = {
	workout: null,
	badges: [],
};
