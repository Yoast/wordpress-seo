import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { NewBadge, PremiumBadge, Slot } from "@yoast/components";
import { useEffect, useMemo } from "@wordpress/element";
import { Button } from "@yoast/components";
import { sortBy } from "lodash";
import SlotWithDefault from "../../components/slots/SlotWithDefault";
import WorkoutCard from "./WorkoutCard";
import { FINISHABLE_STEPS, WORKOUTS } from "../config";

const {
	workouts: workoutsSetting,
} = window.wpseoWorkoutsData;

/**
 * Temporary workoutcard.
 *
 * @returns {wp.Element} A WorkoutCard for the Cornerstone workout.
 */
const CornerStoneCard = () => {
	return <WorkoutCard
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
	/>;
};

/**
 * Temporary workoutcard.
 *
 * @returns {wp.Element} A WorkoutCard for the Orphaned workout.
 */
const OrphanedCard = () => {
	return <WorkoutCard
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
	/>;
};

const upsellWorkouts = {
	[ WORKOUTS.cornerstone ]: CornerStoneCard,
	[ WORKOUTS.orphaned ]: OrphanedCard,
};

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

	/**
	 * Generate slots based on the workout key, and sort by priority.
	 */
	 const slots = useMemo( () => {
		const slotIds = Object.keys( workouts );
		const sortedWorkouts = sortBy( slotIds.map( id => {
			return { ...workouts[ id ], id };
		} ), "priority" );

		return sortedWorkouts.map( workout => {
			if ( upsellWorkouts[ workout.id ] ) {
				const DefaultCard = upsellWorkouts[ workout.id ];
				return <SlotWithDefault key={ workout.id } name={ `${ workout.id }` }>
					<DefaultCard />
				</SlotWithDefault>;
			}
			return <Slot key={ workout.id } name={ `${ workout.id }` } />;
		} );
	}, [ workouts ] );

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
				{ slots }
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
