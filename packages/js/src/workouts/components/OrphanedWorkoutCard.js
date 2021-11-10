// External dependencies.
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
// Internal dependencies.
import WorkoutCard from "./WorkoutCard";
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
	const finishedSteps = useSelect( "yoast-seo/workouts" ).getFinishedSteps( WORKOUTS.orphaned );
	return <WorkoutCard
		name={ WORKOUTS.orphaned }
		title={ __( "Orphaned content", "wordpress-seo" ) }
		subtitle={ __( "Clean up your unlinked content to make sure people can find it", "wordpress-seo" ) }
		usps={ [
			__(
				// eslint-disable-next-line max-len
				"Orphaned content is content that doesn’t get any links from other posts or pages on your site. As a result of that, this content is hard to find, for both Google and visitors. Posts and pages need internal links to them, to fit into a site’s structure and to be findable. With this workout we'll help you update your orphaned content and make sure you have links pointing towards them!",
				"wordpress-seo"
			),
		] }
		image={ "" }
		finishableSteps={ FINISHABLE_STEPS.orphaned }
		finishedSteps={ finishedSteps }
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
