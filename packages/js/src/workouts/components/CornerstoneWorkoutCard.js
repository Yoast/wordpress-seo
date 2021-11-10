// External dependencies.
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
// Internal dependencies.
import WorkoutCard from "./WorkoutCard";
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
} ) {
	const finishedSteps = useSelect( "yoast-seo/workouts" ).getFinishedSteps( WORKOUTS.cornerstone );
	return <WorkoutCard
		name={ WORKOUTS.cornerstone }
		title={ __( "The cornerstone approach", "wordpress-seo" ) }
		subtitle={ __( "Rank with articles you want to rank with", "wordpress-seo" ) }
		usps={ [ __(
			// eslint-disable-next-line max-len
			"On your site you have a few articles that are the most important. You want to rank highest in Google with these articles. At Yoast, we call these articles cornerstone articles. Take the following 4 steps in order to start ranking with your cornerstone articles!",
			"wordpress-seo"
		) ] }
		image={ "" }
		finishableSteps={ FINISHABLE_STEPS.cornerstone }
		finishedSteps={ finishedSteps }
		workout={ workout }
		badges={ badges }
	/>;
}

CornerstoneWorkoutCard.propTypes = {
	workout: PropTypes.func,
	badges: PropTypes.arrayOf( PropTypes.element ),
};

CornerstoneWorkoutCard.defaultProps = {
	workout: null,
	badges: [],
};
