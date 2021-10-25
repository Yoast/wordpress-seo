// External dependencies.
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
// Internal dependencies.
import { PremiumBadge } from "@yoast/components";
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
export default function CornerstoneWorkoutCard( {
	finishedSteps,
	workout,
	badges,
} ) {
	if ( ! workout ) {
		badges.push( <PremiumBadge key={ "premium-badge" } /> );
	}

	return <WorkoutCard
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
		upsell={ upsell }
		workout={ workout }
		badges={ badges }
	/>;
}

CornerstoneWorkoutCard.propTypes = {
	finishedSteps: PropTypes.arrayOf( PropTypes.string ),
	workout: PropTypes.element,
	badges: PropTypes.arrayOf( PropTypes.element ),
};

CornerstoneWorkoutCard.defaultProps = {
	finishedSteps: null,
	workout: null,
	badges: [],
};
