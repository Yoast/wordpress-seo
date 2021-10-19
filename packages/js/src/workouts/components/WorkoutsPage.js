import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { Slot } from "@wordpress/components";
import { NewBadge } from "@yoast/components";
import { FINISHABLE_STEPS, WORKOUTS } from "../config";
import { createInterpolateElement, useCallback, useEffect } from "@wordpress/element";
import { Button } from "@yoast/components";

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
		toggleWorkout,
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
	 * The button to open a workout.
	 *
	 * @param {string} workout The workout name.
	 * @returns {wp.Element} The button.
	 */
	const WorkoutButton = function( { workout } ) {
		let toggle = false;
		let buttonText = "";
		if ( workouts[ workout ].finishedSteps.length === 0 ) {
			buttonText = __( "Start workout!", "wordpress-seo-premium" );
		} else if ( workouts[ workout ].finishedSteps.length < FINISHABLE_STEPS[ workout ].length ) {
			buttonText = __( "Continue workout!", "wordpress-seo-premium" );
		} else {
			buttonText = __( "Do workout again", "wordpress-seo-premium" );
			toggle = true;
		}

		const onClick = useCallback(
			() => {
				openWorkout( workout );
				if ( toggle ) {
					toggleWorkout( workout );
				}
			},
			[ workout, toggle, openWorkout, toggleWorkout ],
		);

		return <Button onClick={ onClick }>{ buttonText }</Button>;
	};

	WorkoutButton.propTypes = {
		workout: PropTypes.string.isRequired,
	};

	return (
		<div>
			<h1>
				{ __( "SEO workouts", "wordpress-seo-premium" ) }
			</h1>
			<p>
				{ __(
					// eslint-disable-next-line max-len
					"Getting your site in shape and keeping it SEO fit can be challenging. Let us help you get started by taking on the most common SEO challenges, with these step by step SEO workouts.",
					"wordpress-seo-premium",
				) }
			</p>
			{ activeWorkout && <Button onClick={ clearActiveWorkout }>{ __( "← Back to all workouts", "worpdress-seo-premium" ) }</Button> }
			{ ! activeWorkout && <div className="workflows__index__grid">

				<Slot name="cornerstone-workout">
					<div className="card card-small">
						<h2>{ __( "The cornerstone approach", "wordpress-seo-premium" ) }</h2>
						<h3>{ __( "Rank with articles you want to rank with", "wordpress-seo-premium" ) }</h3>
						<p>
							{
								createInterpolateElement(
									sprintf(
										__(
											// eslint-disable-next-line max-len
											"On your site you have a few articles that are %1$sthe%2$s most important. You want to rank highest in Google with these articles. At Yoast, we call these articles cornerstone articles. Take the following 4 steps in order to start ranking with your cornerstone articles!",
											"wordpress-seo-premium",
										),
										"<em>",
										"</em>",
									),
									{
										em: <em />,
									},
								)
							}
						</p>
						<span>
							<WorkoutButton workout={ WORKOUTS.cornerstone } />
						</span>
					</div>
				</Slot>
				<Slot name="orphaned-workout">
					{
						( fills ) => {
							return fills.length === 0
								? <div className="card card-small">
									<h2>{ __( "Orphaned content", "wordpress-seo-premium" ) } <NewBadge /></h2>
									<h3>{ __( "Clean up your unlinked content to make sure people can find it", "wordpress-seo-premium" ) }</h3>
									<p>
										{
											createInterpolateElement(
												sprintf(
													__(
														// eslint-disable-next-line max-len
														"Orphaned content is content that doesn’t get any links from other posts or pages on your site. As a result of that, this content is hard to find, for both Google and visitors. Posts and pages need internal links to them, to fit into a site’s structure and to be findable. With this workout we'll help you update your orphaned content and make sure you have links pointing towards them!",
														"wordpress-seo-premium",
													),
													"<em>",
													"</em>",
												),
												{
													em: <em />,
												},
											)
										}
									</p>
									<span>
										<WorkoutButton workout={ WORKOUTS.orphaned } />
									</span>
								</div>
								: fills;
						}
					}
				</Slot>
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
	toggleWorkout: PropTypes.func.isRequired,
	saveWorkouts: PropTypes.func.isRequired,
};
