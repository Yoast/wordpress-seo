import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { NewBadge, PremiumBadge } from "@yoast/components";
import { useEffect } from "@wordpress/element";
import { Button } from "@yoast/components";
import SlotWithDefault from "../../components/slots/SlotWithDefault";
import WorkoutCard from "./WorkoutCard";
import { FINISHABLE_STEPS } from "../config";
import CornerstoneWorkoutCard from "./CornerstoneWorkoutCard";
import OrphanedWorkoutCard from "./OphanedWorkoutCard";

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
					<CornerstoneWorkoutCard finishedSteps={ [] } />
				</SlotWithDefault>
				<SlotWithDefault name="orphaned-workout">
					<OrphanedWorkoutCard finishedSteps={ [] } badges={ [ <NewBadge key={ "new-badge" } /> ] } />
				</SlotWithDefault>
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
