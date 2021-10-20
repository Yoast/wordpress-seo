import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { NewBadge, PremiumBadge, Slot } from "@yoast/components";
import { useEffect } from "@wordpress/element";
import { Button } from "@yoast/components";
import SlotWithDefault from "../../components/slots/SlotWithDefault";
import WorkoutCard from "./WorkoutCard";
import { FINISHABLE_STEPS } from "../config";

const {
	workouts: workoutsSetting,
} = window.wpseoWorkoutsData;

/**
 * Renders the workouts page.
 *
 * @param {object} props The props.
 * @returns {wp.Element} The workouts page.
 * @constructor
 */
export default function WorkoutsPage( props ) {
	const {
		activeWorkout,
		clearActiveWorkout,
		openWorkout,
		workouts,
		loading,
		initWorkouts,
		saveWorkouts,
	} = props;

	useEffect( () => {
		// Loads the workouts on first render.
		if ( loading === true ) {
			initWorkouts( workoutsSetting );
			if ( window.location.hash && window.location.hash.length > 1 ) {
				openWorkout( window.location.hash.substr( 1 ) );
			}
			return;
		}

		// Saves the workouts on change.
		saveWorkouts( workouts );
	}, [ workouts, loading ] );

	const slotIds = Object.keys( workouts );

	return (
		<div>
			<h1>
				{ __( "SEO workouts", "wordpress-seo-premium" ) }
			</h1>
			<p>
				{ __(
					// eslint-disable-next-line max-len
					"Getting your site in shape and keeping it SEO fit can be challenging. Let us help you get started by taking on the most common SEO challenges, with these step by step SEO workouts.",
					"wordpress-seo"
				) }
			</p>
			{ activeWorkout && <Button onClick={ clearActiveWorkout }>{ __( "← Back to all workouts", "worpdress-seo" ) }</Button> }
			{ ! activeWorkout && <div className="workflows__index__grid">
				<SlotWithDefault name="cornerstone-workout">
					<WorkoutCard
						title={ __( "The cornerstone approach", "wordpress-seo" ) }
						badges={ [ <PremiumBadge key={ "premium-badge" } /> ] }
						subtitle={ __( "Rank with articles you want to rank with", "wordpress-seo" ) }
						usps={ [
							__(
								// eslint-disable-next-line max-len
								"On your site you have a few articles that are the most important. You want to rank highest in Google with these articles. At Yoast, we call these articles cornerstone articles. Take the following 4 steps in order to start ranking with your cornerstone articles!",
								"wordpress-seo"
							),
						] }
						finishableSteps={ FINISHABLE_STEPS.cornerstone }
						finishedSteps={ [] }
					/>
				</SlotWithDefault>
				<SlotWithDefault name="orphaned-workout">
					<WorkoutCard
						title={ __( "Orphaned content", "wordpress-seo" ) }
						badges={ [ <PremiumBadge key={ "premium-badge" } />, <NewBadge key={ "new-badge" } /> ] }
						subtitle={ __( "Clean up your unlinked content to make sure people can find it", "wordpress-seo" ) }
						usps={ [
							__(
								// eslint-disable-next-line max-len
								"Orphaned content is content that doesn’t get any links from other posts or pages on your site. As a result of that, this content is hard to find, for both Google and visitors. Posts and pages need internal links to them, to fit into a site’s structure and to be findable. With this workout we'll help you update your orphaned content and make sure you have links pointing towards them!",
								"wordpress-seo"
							),
						] }
						finishableSteps={ FINISHABLE_STEPS.orphaned }
						finishedSteps={ [] }
					/>
				</SlotWithDefault>
				{
					slotIds.map( id => <Slot key={ id } name={ id } /> )
				}
			</div> }
		</div>
	);
}

WorkoutsPage.propTypes = {
	activeWorkout: PropTypes.string.isRequired,
	clearActiveWorkout: PropTypes.func.isRequired,
	openWorkout: PropTypes.func.isRequired,
	workouts: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
	initWorkouts: PropTypes.func.isRequired,
	saveWorkouts: PropTypes.func.isRequired,
};
