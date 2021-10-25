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
export default function OrphanedWorkoutCard( {
	steps,
	finishedSteps,
	workout,
	badges,
} ) {
	const title = __( "Orphaned content", "wordpress-seo" );
	const subtitle = __( "Clean up your unlinked content to make sure people can find it", "wordpress-seo" );
	const usps = [
		__(
			// eslint-disable-next-line max-len
			"Orphaned content is content that doesn’t get any links from other posts or pages on your site. As a result of that, this content is hard to find, for both Google and visitors. Posts and pages need internal links to them, to fit into a site’s structure and to be findable. With this workout we'll help you update your orphaned content and make sure you have links pointing towards them!",
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
		finishableSteps={ FINISHABLE_STEPS.orphaned }
		finishedSteps={ finishedSteps }
		upsell={ upsell }
		workout={ workout }
		badges={ badges }
	/>;
}

OrphanedWorkoutCard.propTypes = {
	finishedSteps: PropTypes.arrayOf( PropTypes.string ).isRequired,
	steps: PropTypes.arrayOf( PropTypes.string ),
	workout: PropTypes.element,
	badges: PropTypes.arrayOf( PropTypes.element ),
};

OrphanedWorkoutCard.defaultProps = {
	steps: [],
	workout: null,
	badges: [],
};
