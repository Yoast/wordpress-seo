// External dependencies.
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
// Internal dependencies.
import WorkoutCard from "./WorkoutCard";
import WorkoutUpsell from "./WorkoutUpsell";
import { FINISHABLE_STEPS } from "../config";

/**
 * Creates a WorkoutUpsell component.
 *
 * @param {Object} props The props object.
 *
 * @returns {wp.Element} The WorkoutUpsell component.
 */
const upsell = ( props ) => {
	return <WorkoutUpsell
		title={ "Get Yoast SEO Premium!" }
		addOn={ "Premium" }
		upsellLink={ "https://www.yoast.com" }
		onRequestClose={ props.onRequestClose }
	>
		<p>You should definitely buy Premium</p>
	</WorkoutUpsell>;
};

/**
 * The CornerstoneWorkoutCard component.
 *
 * @param {Object} props The props object.
 *
 * @returns {WPElement} The CornerstoneWorkoutCard component.
 */
export default function OrphanedWorkoutCard( {
	finishedSteps,
	workout,
	badges,
} ) {
	return <WorkoutCard
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
		upsell={ upsell }
		workout={ workout }
		badges={ badges }
	/>;
}

OrphanedWorkoutCard.propTypes = {
	finishedSteps: PropTypes.arrayOf( PropTypes.string ),
	workout: PropTypes.func,
	badges: PropTypes.arrayOf( PropTypes.element ),
};

OrphanedWorkoutCard.defaultProps = {
	finishedSteps: null,
	workout: null,
	badges: [],
};
