// External dependencies.
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { useCallback, useState, useMemo, useEffect } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
// Internal dependencies.
import { Button, ProgressBar } from "@yoast/components";

/**
 * The WorkoutCard component
 *
 * @param {Object} props The props object.
 *
 * @returns {WPElement} The WorkoutCard component
 */
export default function WorkoutCard( {
	title,
	subtitle,
	usps,
	image,
	finishableSteps,
	finishedSteps,
	upsell,
	workout,
	badges,
} ) {
	const { openWorkout, toggleWorkout } = useDispatch( "yoast-seo/workouts" );
	const activeWorkout = useSelect( ( select ) => {
		return select( "yoast-seo/workouts" ).getActiveWorkout();
	}, [] );

	const [ isUpsellOpen, setUpsellOpen ] = useState( false );
	const [ isToggle, setToggle ] = useState( false );

	const UpsellComponent = upsell;
	const closeUpsell = useCallback( () => setUpsellOpen( false ), [] );
	const openUpsell = useCallback( () => setUpsellOpen( true ), [] );

	const WorkoutComponent = workout;

	useEffect( () => {
		if ( finishableSteps && finishedSteps && finishedSteps.length === finishableSteps.length ) {
			setToggle( true );
		}
	}, [ finishedSteps, finishableSteps ] );

	const buttonText = useMemo( () => {
		if ( ! finishedSteps || finishedSteps.length === 0 ) {
			return __( "Start workout!", "wordpress-seo" );
		} else if ( finishedSteps.length < finishableSteps.length ) {
			return __( "Continue workout!", "wordpress-seo" );
		}
		return __( "Do workout again", "wordpress-seo" );
	},
	  [ finishedSteps, finishableSteps ]
	);

	const onClick = useCallback(
		() => {
			if ( workout ) {
				openWorkout( workout.name );
				if ( isToggle ) {
					toggleWorkout( workout.name );
				}
			} else {
				openUpsell();
			}
		},
		[ workout, isToggle, openWorkout, toggleWorkout ]
	);

	return ( <>
		{ ! activeWorkout && <div className={ "card card-small" }>
			<h2>{ title } { badges }</h2>
			<h3>{ subtitle }</h3>
			<ul>
				{
					usps.map( ( usp, index ) => <li key={ `${ title }-${ index }` }>{ usp }</li> )
				}
			</ul>
			{ image && <img src={ image } alt="" /> }
			<span>
				<Button onClick={ onClick }>{ buttonText }</Button>
				{ finishableSteps && finishedSteps &&
				<>
					<ProgressBar
						id={ `${title}-workout-progress` }
						max={ finishableSteps.length }
						value={ finishedSteps.length }
					/>
					<label htmlFor={ `${title}-workout-progress` }><em>
						{
							sprintf(
								// translators: %1$s: number of finished steps, %2$s: number of finishable steps
								__(
									"%1$s/%2$s steps completed",
									"wordpress-seo"
								),
								finishedSteps.length,
								finishableSteps.length
							)
						}
					</em></label>
				</> }
			</span>
			{ upsell && isUpsellOpen && <UpsellComponent onRequestClose={ closeUpsell } /> }
		</div> }
		{ workout && activeWorkout === workout.name && <WorkoutComponent onRequestClose={ closeUpsell } /> }
	</>	);
}

WorkoutCard.propTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	usps: PropTypes.arrayOf( PropTypes.string ).isRequired,
	finishableSteps: PropTypes.arrayOf( PropTypes.string ),
	finishedSteps: PropTypes.arrayOf( PropTypes.string ),
	image: PropTypes.string,
	upsell: PropTypes.func,
	workout: PropTypes.func,
	badges: PropTypes.arrayOf( PropTypes.element ),
};

WorkoutCard.defaultProps = {
	image: null,
	upsell: null,
	workout: null,
	badges: [],
	finishableSteps: null,
	finishedSteps: null,
};
