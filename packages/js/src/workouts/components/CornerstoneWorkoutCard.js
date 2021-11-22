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
	isPremiumUnactivated,
} ) {
	const finishedSteps = useSelect( "yoast-seo/workouts" ).getFinishedSteps( WORKOUTS.cornerstone );
	return <WorkoutCard
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
		upsellLink={ isPremiumUnactivated ? "https://yoa.st/workouts-activate-notice-myyoast" : "https://yoa.st/workout-cornerstone-upsell" }
		workout={ workout }
		badges={ badges }
	/>;
}

CornerstoneWorkoutCard.propTypes = {
	workout: PropTypes.func,
	badges: PropTypes.arrayOf( PropTypes.element ),
	isPremiumUnactivated: PropTypes.bool,
};

CornerstoneWorkoutCard.defaultProps = {
	workout: null,
	badges: [],
	isPremiumUnactivated: false,
};
