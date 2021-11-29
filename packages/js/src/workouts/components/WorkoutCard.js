// External dependencies.
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { useCallback, useState, useMemo, useEffect, Fragment } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
// Internal dependencies.
import { NewButton as Button, ProgressBar } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";

/* eslint-disable complexity */
/**
 * The WorkoutCard component
 *
 * @param {Object} props The props object.
 *
 * @returns {WPElement} The WorkoutCard component
 */
export default function WorkoutCard( {
	name,
	title,
	subtitle,
	usps,
	image,
	finishableSteps,
	finishedSteps,
	upsellLink,
	upsellText,
	workout,
	badges,
	blocked,
} ) {
	const { openWorkout, toggleWorkout } = useDispatch( "yoast-seo/workouts" );
	const activeWorkout = useSelect( ( select ) => {
		return select( "yoast-seo/workouts" ).getActiveWorkout();
	}, [] );

	const [ isToggle, setToggle ] = useState( false );

	const WorkoutComponent = workout;
	const ImageComponent = image;

	useEffect( () => {
		if ( finishableSteps && finishedSteps && finishedSteps.length === finishableSteps.length ) {
			setToggle( true );
		} else {
			setToggle( false );
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
			openWorkout( name );
			if ( isToggle ) {
				toggleWorkout( name );
			}
		},
		[ workout, isToggle, openWorkout, toggleWorkout ]
	);

	const UpsellButton = makeOutboundLink();
	const actualUpsellText = upsellText ? upsellText : sprintf(
		/* translators: %s : Expands to the add-on name. */
		__( "Unlock with %s!", "wordpress-seo" ),
		"Premium"
	);
	const disabled = workout && ! blocked ? "" : " card-disabled";

	return ( <Fragment>
		{ ! activeWorkout && <div className={ `card card-small${ disabled }` }>
			<h2>{ title } { badges }</h2>
			<h3>{ subtitle }</h3>
			<div className="workout-card-content-flex">
				<ul className="yoast-list--usp">
					{
						usps.map( ( usp, index ) => <li key={ `${ title }-${ index }` }>{ usp }</li> )
					}
				</ul>
				{ image && <ImageComponent /> }
			</div>
			<span>
				{ ! blocked && workout && <Button onClick={ onClick }>{ buttonText }</Button> }
				{ ! workout &&
					<UpsellButton href={ upsellLink } className="yoast-button yoast-button-upsell">
						{ actualUpsellText }
						<span aria-hidden="true" className="yoast-button-upsell__caret" />
					</UpsellButton>
				}
				{ finishableSteps && finishedSteps &&
				<div className="workout-card-progress">
					<ProgressBar
						id={ `${title}-workout-progress` }
						max={ finishableSteps.length }
						value={ finishedSteps.length }
					/>
					<label htmlFor={ `${title}-workout-progress` }><i>
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
					</i></label>
				</div> }
			</span>
			{ blocked && workout && <div className="workout-card-blocked">
				<p className="workout-card-blocked-title">{ __( "Configuration required", "wordpress-seo" ) }</p>
				<p>{ __( "Please finish the Configuration workout first in order for this workout to be effective.", "wordpress-seo" ) }</p>
			</div> }
		</div> }
		{ workout && activeWorkout === name && <WorkoutComponent /> }
	</Fragment>	);
}

WorkoutCard.propTypes = {
	name: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	usps: PropTypes.arrayOf( PropTypes.string ).isRequired,
	finishableSteps: PropTypes.arrayOf( PropTypes.string ),
	finishedSteps: PropTypes.arrayOf( PropTypes.string ),
	image: PropTypes.func,
	upsellLink: PropTypes.string,
	upsellText: PropTypes.string,
	workout: PropTypes.func,
	badges: PropTypes.arrayOf( PropTypes.element ),
	blocked: PropTypes.bool,
};

WorkoutCard.defaultProps = {
	finishableSteps: null,
	finishedSteps: null,
	image: null,
	upsellLink: null,
	upsellText: null,
	workout: null,
	badges: [],
	blocked: false,
};
/* eslint-enable complexity */
