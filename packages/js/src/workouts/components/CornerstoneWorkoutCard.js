// External dependencies.
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
// Internal dependencies.
import { PremiumBadge } from "@yoast/components";
import WorkoutCard from "./WorkoutCard";
import WorkoutUpsell from "./WorkoutUpsell";
import { FINISHABLE_STEPS } from "../config";

/**
 * The CornerstoneWorkoutCard component.
 *
 * @param {Object} props The props object.
 *
 * @returns {WPElement} The CornerstoneWorkoutCard component.
 */
export default function CornerstoneWorkoutCard( {
	steps,
	finishedSteps,
	workout,
	badges,
} ) {
	const title = __( "The cornerstone approach", "wordpress-seo" );
	const subtitle = __( "Rank with articles you want to rank with", "wordpress-seo" );
	const usps = [
		__(
			// eslint-disable-next-line max-len
			"On your site you have a few articles that are the most important. You want to rank highest in Google with these articles. At Yoast, we call these articles cornerstone articles. Take the following 4 steps in order to start ranking with your cornerstone articles!",
			"wordpress-seo"
		),
	];
	const image = "";

	/**
	 * Creates a WorkoutUpsell component.
	 *
	 * @param {Object} onRequestClose The onRequestClose for the upsell component.
	 *
	 * @returns {Object} The WorkoutUpsell component.
	 */
	const upsell = function( onRequestClose ) {
		return <WorkoutUpsell
			title={ "Get Yoast SEO Premium!" }
			addOn={ "Premium" }
			upsellLink={ "https://www.yoast.com" }
			onRequestClose={ onRequestClose }
		>
			<p>Are you convinced?!</p>
		</WorkoutUpsell>;
	};

	if ( ! workout ) {
		badges.push( <PremiumBadge /> );
	}

	return <WorkoutCard
		title={ title }
		subtitle={ subtitle }
		usps={ usps }
		image={ image }
		steps={ steps }
		finishableSteps={ FINISHABLE_STEPS.cornerstone }
		finishedSteps={ finishedSteps }
		upsell={ upsell }
		workout={ workout }
		badges={ badges }
	/>;
}

CornerstoneWorkoutCard.propTypes = {
	finishedSteps: PropTypes.arrayOf( PropTypes.string ).isRequired,
	steps: PropTypes.arrayOf( PropTypes.string ),
	workout: PropTypes.element,
	badges: PropTypes.arrayOf( PropTypes.element ),
};

CornerstoneWorkoutCard.defaultProps = {
	steps: [],
	workout: null,
	badges: [],
};
