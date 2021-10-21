import PropTypes from "prop-types";
import { Button } from "@yoast/components";
import { __ } from "@wordpress/i18n";
import { FINISHABLE_STEPS, WORKOUTS } from "../config";
import { useCallback, useEffect, useState } from "@wordpress/element";
import { openWorkout, toggleWorkout } from "../redux/actions";
import { Modal } from "@wordpress/components";

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
	steps,
	finishedSteps,
	upsell,
	workout,
	badges,
	priority,
} ) {

	const [ isUpsellOpen, setUpsellOpen ] = useState( false );

	let classes = [
		"card",
		"card-small",
	];

	const onUpsellClose = function() {
		setUpsellOpen( false );
		classes = [ "card", "card-small" ];
	};

	const onButtonClick = function() {
		setUpsellOpen( true );
		classes = [ "card" ];
	};

	useEffect( () => {
		if  ( isUpsellOpen ) {
			classes = [ "card" ];
		} else {
			classes = [ "card", "card-small" ];
		}
	}, [ isUpsellOpen ] );

	/**
	 * The button to open a workout.
	 *
	 * @returns {wp.Element} The button.
	 */
	const WorkoutButton = function() {
		let toggle = false;
		let buttonText = __( "Start workout!", "wordpress-seo" );
		let onClick = onButtonClick;
		if ( workout ) {
			if ( finishedSteps.length === 0 ) {
				buttonText = __( "Start workout!", "wordpress-seo" );
			} else if ( finishedSteps.length < FINISHABLE_STEPS[ workout ].length ) {
				buttonText = __( "Continue workout!", "wordpress-seo" );
			} else {
				buttonText = __( "Do workout again", "wordpress-seo" );
				toggle = true;
			}

			onClick = useCallback(
				() => {
					openWorkout( workout );
					if ( toggle ) {
						toggleWorkout( workout );
					}
				},
				[ workout, toggle, openWorkout, toggleWorkout ]
			);
		}

		return <Button onClick={ onClick }>{ buttonText }</Button>;
	};

	return <div className={ classes.join( " " ) }>
		<h2>{ title }{ badges }</h2>
		<h3>{ subtitle }</h3>
		<ul>
			{
				usps.map( ( usp, index ) => <li key={ `${ title }-${ index }` }>{ usp }</li> )
			}
		</ul>
		<img src={ image } alt="" />
		<span>
			<WorkoutButton />
		</span>
		{ isUpsellOpen && <Modal
			title={ title }
			onRequestClose={ onUpsellClose }
		>
			<p>Some upsell text</p>
		</Modal> }
	</div>;
}

WorkoutCard.propTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	usps: PropTypes.arrayOf( PropTypes.string ).isRequired,
	image: PropTypes.string,
	steps: PropTypes.arrayOf( PropTypes.string ).isRequired,
	finishedSteps: PropTypes.arrayOf( PropTypes.string ).isRequired,
	upsell: PropTypes.element,
	workout: PropTypes.element,
	badges: PropTypes.arrayOf( PropTypes.element ),
	priority: PropTypes.number,
};

WorkoutCard.defaultProps = {
	image: null,
	upsell: null,
	workout: null,
	badges: [],
	priority: 50,
};
