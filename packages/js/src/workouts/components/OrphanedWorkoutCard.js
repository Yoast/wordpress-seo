import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { ReactComponent as OrphanedImageBubble } from "../../../../../images/mirrored_fit_bubble_woman_2_optim.svg";
import { FINISHABLE_STEPS, WORKOUTS } from "../config";
import WorkoutCard from "./WorkoutCard";

/**
 * The CornerstoneWorkoutCard component.
 *
 * @param {Object} props The props object.
 * @param {React.ReactNode} [props.workout=null] The workout function.
 * @param {Array<JSX.Element>} [props.badges=[]] The badges to display in the card.
 * @param {?string} [props.upsellLink=null] The link to the upsell page for the workout.
 * @param {?string} [props.upsellText=null] The text for the upsell link.
 *
 * @returns {JSX.Element} The CornerstoneWorkoutCard component.
 */
export default function OrphanedWorkoutCard( {
	workout = null,
	badges = [],
	upsellLink = null,
	upsellText = null,
} ) {
	const finishedSteps = useSelect( select => select( "yoast-seo/workouts" ).getFinishedSteps( WORKOUTS.orphaned ) );
	const actualUpsellLink = upsellLink ? upsellLink : "https://yoa.st/workout-orphaned-content-upsell";

	return <WorkoutCard
		id={ "orphaned-workout-card" }
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
		upsellLink={ actualUpsellLink }
		upsellText={ upsellText }
		workout={ workout }
		badges={ badges }
	/>;
}

OrphanedWorkoutCard.propTypes = {
	workout: PropTypes.elementType,
	badges: PropTypes.arrayOf( PropTypes.element ),
	upsellLink: PropTypes.string,
	upsellText: PropTypes.string,
};
