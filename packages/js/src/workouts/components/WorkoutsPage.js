import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { Slot } from "@wordpress/components";
import { useEffect, useMemo } from "@wordpress/element";
import { sortBy } from "lodash";

import { Button, PremiumBadge } from "@yoast/components";
import SlotWithDefault from "../../components/slots/SlotWithDefault";
import CornerstoneWorkoutCard from "./CornerstoneWorkoutCard";
import OrphanedWorkoutCard from "./OrphanedWorkoutCard";
import { WORKOUTS } from "../config";

const {
	workouts: workoutsSetting,
	upsellLink,
	upsellText,
} = window.wpseoWorkoutsData;

/**
 * The Free (upsell) CornerstoneWorkoutCard.
 *
 * @returns {wp.Element} A WorkoutCard for the Cornerstone workout.
 */
const CornerstoneCard = () => {
	return <CornerstoneWorkoutCard
		badges={ [ <PremiumBadge key={ "premium-badge-cornerstone-workout" } /> ] }
		upsellLink={ upsellLink }
		upsellText={ upsellText }
	/>;
};

/**
 * The Free (upsell) OrphanedWorkoutCard.
 *
 * @returns {wp.Element} A WorkoutCard for the Orphaned workout.
 */
const OrphanedCard = () => {
	return <OrphanedWorkoutCard
		badges={ [ <PremiumBadge key={ "premium-badge-orphaned-workout" } /> ] }
		upsellLink={ upsellLink }
		upsellText={ upsellText }
	/>;
};

const upsellWorkouts = {
	[ WORKOUTS.cornerstone ]: CornerstoneCard,
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
				{ __( "SEO workouts", "wordpress-seo" ) }
			</h1>
			<p>
				{ __(
					// eslint-disable-next-line max-len
					"Getting your site in shape and keeping it SEO fit can be hard. We can help you get started! Take these step-by-step workouts, and you’ll be tackling some of the most fundamental SEO challenges!",
					"wordpress-seo"
				) }
			</p>
			{ activeWorkout && <Button onClick={ clearActiveWorkout }>{
				// translators: %1$s translates to a leftward pointing arrow ( ← )
				sprintf( __( "%1$sBack to all workouts", "worpdress-seo" ), "← " )
			}</Button> }
			 <div className={ activeWorkout ? "" : "workflows__index" }>
				{ slots }
			</div>
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
