import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { ReactComponent as CornerstoneImageBubble } from "../../../../../images/mirrored_fit_bubble_man_1_optim.svg";
import { FINISHABLE_STEPS, WORKOUTS } from "../config";
import WorkoutCard from "./WorkoutCard";

/**
 * The CornerstoneWorkoutCard component.
 *
 * @param {Object} props The props object.
 * @param {React.ReactNode} [props.workout=null] The workout component to render.
 * @param {Array<JSX.Element>} [props.badges=[]] The badges to display.
 * @param {?string} [props.upsellLink=null] The upsell link URL.
 * @param {?string} [props.upsellText=null] The upsell button text.
 *
 * @returns {JSX.Element} The CornerstoneWorkoutCard component.
 */
export default function CornerstoneWorkoutCard( {
	workout = null,
	badges = [],
	upsellLink = null,
	upsellText = null,
} ) {
	const finishedSteps = useSelect( select => select( "yoast-seo/workouts" ).getFinishedSteps( WORKOUTS.cornerstone ) );
	const actualUpsellLink = upsellLink ? upsellLink : "https://yoa.st/workout-cornerstone-upsell";

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
	/>;
}

CornerstoneWorkoutCard.propTypes = {
	workout: PropTypes.elementType,
	badges: PropTypes.arrayOf( PropTypes.element ),
	upsellLink: PropTypes.string,
	upsellText: PropTypes.string,
};
