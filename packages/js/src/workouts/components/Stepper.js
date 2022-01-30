import { CheckIcon } from "@heroicons/react/solid";
import { Fragment, useCallback, useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import AnimateHeight from "react-animate-height";

// CONSTANTS

// Open and close duration in milliseconds.
const openAndCloseDuration = 500;

// Fade in and out duration in milliseconds.
const fadeDuration = 200;

// The duration of no movement between opening and closing steps.
const pauseDuration = 200;

// Wait for previous step to close, fade, and add the pause.
const openDelay = openAndCloseDuration + fadeDuration + pauseDuration;

// Wait for the step to have opened
const fadeInDelay = openDelay + openAndCloseDuration;

// Wait for the step to have faded out
const closeDelay = fadeDuration;

// Tailwindclasses based on the above:
const fadeDurationClass = "yst-duration-200";
const totalStepDurationClass = "yst-duration-700";
const openDelayClass = "yst-delay-900";

/**
 * The StepButtons component.
 *
 * @param {Object}   props                    The props object.
 * @param {number}   props.stepIndex          The index of the current step.
 * @param {number}   props.lastIndex          The index of the last step.
 * @param {function} props.handlePrimaryClick A function to call when the primary button is clicked.
 * @param {function} props.goBack             A function to call when the "Go Back" button is clicked.
 *
 * @returns {WPElement} The StepButtons component.
 */
function StepButtons( { stepIndex, lastIndex, handlePrimaryClick, goBack } ) {
	return <div className="yst-mt-12">
		<button
			onClick={ handlePrimaryClick }
			className="yst-button--primary"
		>
			{ stepIndex < lastIndex
				? __( "Save and continue", "wordpress-seo" )
				: __( "Finish this workout", "wordpress-seo" ) }
		</button>
		{ stepIndex > 0 && <button
			onClick={ goBack }
			className="yst-button--secondary yst-ml-3"
		>
			{ __( "Go back", "wordpress-seo" ) }
		</button>
		}
	</div>;
}

StepButtons.propTypes = {
	stepIndex: PropTypes.number.isRequired,
	lastIndex: PropTypes.number.isRequired,
	handlePrimaryClick: PropTypes.func.isRequired,
	goBack: PropTypes.func.isRequired,
};

/**
 * Gets the classnames for the step name.
 *
 * @param {boolean} isSaved      Whether the step is saved.
 * @param {boolean} isActiveStep Whether the step is active.
 *
 * @returns {string} The classnames for the step name.
 */
function getNameClassnames( isSaved, isActiveStep ) {
	if ( isActiveStep ) {
		return "yst-text-primary-500";
	}
	return isSaved ? "" : "yst-text-gray-500";
}

const stepShape = PropTypes.shape( {
	name: PropTypes.string.isRequired,
	description: PropTypes.string,
	component: PropTypes.element.isRequired,
	isSaved: PropTypes.bool.isRequired,
} );


/**
 *The ActiveCircle element.
 *
 * @param {Object} props The props object.
 * @param {Bool} props.isVisible Whether this circle is visible or not.
 *
 * @returns {WPElement} The ActiveCircle element
 */
function ActiveCircle( { isVisible } ) {
	return <span
		className={ `yst-transition-opacity ${ totalStepDurationClass } ${ isVisible ? "yst-opacity-100" : "yst-opacity-0" } yst-absolute yst-inset-0 yst-bg-white yst-border-primary-500 yst-border-2 yst-flex yst-items-center yst-justify-center yst-rounded-full` }
	>
		<span className={ "yst-h-2.5 yst-w-2.5 yst-rounded-full yst-bg-primary-500" } />
	</span>;
}

ActiveCircle.propTypes = {
	isVisible: PropTypes.bool,
};

ActiveCircle.defaultProps = {
	isVisible: true,
};

/**
 *The SavedCircle element.
 *
 * @param {Object} props The props object.
 * @param {Bool} props.isVisible Whether this circle is visible or not.
 *
 * @returns {WPElement} The SavedCircle element
 */
function SavedCircle( { isVisible } ) {
	return <span
		className={ `yst-transition-opacity ${ totalStepDurationClass } ${ isVisible ? "yst-opacity-100" : "yst-opacity-0" } yst-absolute yst-inset-0 yst-bg-primary-500 yst-border-primary-500 yst-border-2 yst-flex yst-items-center yst-justify-center yst-rounded-full` }
	>
		<CheckIcon className={ "yst-w-5 yst-h-5 yst-text-white" } aria-hidden="true" />
	</span>;
}

SavedCircle.propTypes = {
	isVisible: PropTypes.bool,
};

SavedCircle.defaultProps = {
	isVisible: true,
};

/**
 *The UpcomingCircle element.
 *
 * @param {Object} props The props object.
 * @param {Bool} props.isVisible Whether this circle is visible or not.
 *
 * @returns {WPElement} The UpcomingCircle element
 */
function UpcomingCircle( { isVisible } ) {
	return <span
		className={ `yst-transition-opacity ${ totalStepDurationClass } ${ isVisible ? "yst-opacity-100" : "yst-opacity-0" } yst-absolute yst-inset-0 yst-bg-white yst-border-gray-300 yst-border-2 yst-flex yst-items-center yst-justify-center yst-rounded-full` }
	>
		<span className={ "yst-h-2.5 yst-w-2.5 yst-rounded-full yst-bg-transparent" } />
	</span>;
}

UpcomingCircle.propTypes = {
	isVisible: PropTypes.bool,
};

UpcomingCircle.defaultProps = {
	isVisible: true,
};

/**
 * The Circle that acompanies a step, in all its active-inactive saved-unsaved flavours.
 *
 * @param {Object} props The props to pass to the StepCircle
 *
 * @returns {WPElement} The StepCircle component.
 */
function StepCircle( { activationDelay, deactivationDelay, isActive, isSaved } ) {
	const [ circleType, setCircleType ] = useState( isSaved ? "saved" : "upcoming" );

	useEffect( () => {
		if ( isActive ) {
			// Set deactivation delay on the active class, mind the ending space.
			setTimeout( () => {
				setCircleType( "active" );
			}, activationDelay );
			return;
		}
		// Set activation delay on the inactive class, mind the ending space.
		setTimeout( () => {
			setCircleType( isSaved ? "saved" : "upcoming" );
		}, deactivationDelay );
	}, [ isActive, activationDelay, deactivationDelay, isSaved ] );

	return <span
		className={ "yst-relative yst-z-10 yst-w-8 yst-h-8 yst-rounded-full" }
	>
		<UpcomingCircle isVisible={ true } />
		<SavedCircle isVisible={ circleType === "saved" } />
		<ActiveCircle isVisible={ circleType === "active" } />
	</span>;
}

StepCircle.propTypes = {
	isActive: PropTypes.bool.isRequired,
	isSaved: PropTypes.bool.isRequired,
	activationDelay: PropTypes.number,
	deactivationDelay: PropTypes.number,
};

StepCircle.defaultProps = {
	activationDelay: 0,
	deactivationDelay: 0,
};

// There is no fade out delay.

/* eslint-disable complexity, max-len */
/**
 * The (Tailwind) Step component
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Step component.
 */
function TailwindStep( { step, stepIndex, lastStepIndex, saveStep, finishStepper, activeStepIndex, setActiveStepIndex } ) {
	const isActiveStep = activeStepIndex === stepIndex;
	const isSaved = step.isSaved;
	const [ contentHeight, setContentHeight ] = useState( isActiveStep ? "auto" : 0 );
	const [ isFaded, setIsFaded ] = useState( ! isActiveStep );

	const nameClassNames = getNameClassnames( isSaved, isActiveStep );

	const handlePrimaryClick = useCallback(
		() => {
			const currentStep = stepIndex;
			const nextStep = stepIndex + 1;
			if ( currentStep === lastStepIndex ) {
				finishStepper();
			} else {
				saveStep( currentStep );
				setActiveStepIndex( nextStep );
			}
		},
		[ setActiveStepIndex, saveStep, finishStepper, stepIndex, lastStepIndex ]
	);

	const goBack = useCallback( () => {
		setActiveStepIndex( stepIndex - 1 );
	}, [ stepIndex, setActiveStepIndex ] );

	useEffect( () => {
		if ( isActiveStep ) {
			setContentHeight( "auto" );
			// Wait until all other animations are done.
			setTimeout( () => setIsFaded( false ), fadeInDelay );
		} else {
			setIsFaded( true );
			setContentHeight( 0 );
		}
	}, [ isActiveStep ] );

	return (
		<Fragment>
			{
				// Line
				( stepIndex !== lastStepIndex ) &&
				<Fragment>
					<div
						className={ "yst--ml-px yst-absolute yst-left-4 yst-w-0.5 yst-h-full yst-bg-gray-300 yst--bottom-6" }
						aria-hidden="true"
					/>
					<div
						className={ `yst-h-full yst-transition-transform yst-ease-in-out ${ totalStepDurationClass } yst-origin-top ${ stepIndex < activeStepIndex  ? `${ openDelayClass } yst-scale-y-1` : "yst-scale-y-0" } yst--ml-px yst-absolute yst-left-4 yst-w-0.5 yst-bg-primary-500 yst-top-8` }
						aria-hidden="true"
					/>
				</Fragment>
			}
			<div className="yst-relative yst-flex yst-items-start yst-group" aria-current={ isActiveStep ? "step" : null }>
				<span className="yst-flex yst-items-center" aria-hidden={ isActiveStep ? "true" : null }>
					<StepCircle
						isActive={ isActiveStep }
						isSaved={ isSaved }
						activationDelay={ openDelay }
						deactivationDelay={ 0 }
					/>
				</span>
				{ /* Name and description. */ }
				<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col yst-self-center">
					<span className={ "yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase " + nameClassNames }>
						{ step.name }
					</span>
					{ step.description && <span className="yst-text-sm yst-text-gray-500">{ step.description }</span> }
				</span>
			</div>
			{ /* Child component and buttons. */ }
			<AnimateHeight
				id={ `content-${stepIndex}` }
				delay={ contentHeight === 0 ? closeDelay : openDelay }
				height={ contentHeight }
				easing="ease-in-out"
				duration={ openAndCloseDuration }
			>
				<div className={ `yst-transition-opacity ${ fadeDurationClass } yst-relative yst-ml-12 yst-mt-4 ${ isFaded ? "yst-opacity-0 yst-no-point-events" : "yst-opacity-100" }` }>
					{ step.component }
					<StepButtons
						stepIndex={ stepIndex }
						lastIndex={ lastStepIndex }
						handlePrimaryClick={ handlePrimaryClick }
						goBack={ goBack }
					/>
				</div>
			</AnimateHeight>
		</Fragment>
	);
}
TailwindStep.propTypes = {
	step: stepShape.isRequired,
	stepIndex: PropTypes.number.isRequired,
	lastStepIndex: PropTypes.number.isRequired,
	setActiveStepIndex: PropTypes.func.isRequired,
	saveStep: PropTypes.func,
	finishStepper: PropTypes.func,
	activeStepIndex: PropTypes.number.isRequired,
};
TailwindStep.defaultProps = {
	saveStep: () => { },
	finishStepper: () => { },
};
/**
 * The Tailwind Stepper component.
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Stepper component.
 */
export default function Stepper( { steps, setActiveStepIndex, saveStep, finishStepper, activeStepIndex } ) {
	return (
		<ol className="yst-overflow-hidden">
			{ steps.map( ( step, stepIndex ) => (
				<li key={ step.name } className={ ( stepIndex === steps.length - 1 ? "" : "yst-pb-8" ) + " yst-mb-0 yst-relative" }>
					<TailwindStep
						step={ step }
						stepIndex={ stepIndex }
						lastStepIndex={ steps.length - 1 }
						setActiveStepIndex={ setActiveStepIndex }
						saveStep={ saveStep }
						finishStepper={ finishStepper }
						activeStepIndex={ activeStepIndex }
					/>
				</li>
			) ) }
		</ol>
	);
}
Stepper.propTypes = {
	steps: PropTypes.arrayOf( stepShape ).isRequired,
	setActiveStepIndex: PropTypes.func.isRequired,
	saveStep: PropTypes.func,
	finishStepper: PropTypes.func,
	activeStepIndex: PropTypes.number.isRequired,
};
Stepper.defaultProps = {
	saveStep: () => { },
	finishStepper: () => { },
};
/* eslint-enable complexity, max-len */

// HELPER FUNCTION. Should probably be moved to a separate helper class?
/**
 * Gets the index to expand on first render of the stepper.
 *
 * If available, the index of the first unsaved step is returned.
 * If all steps have been finished, the index of the last step is returned.
 * Otherwise, returns the index of the first step.
 *
 * @param {Boolean[]} isSavedSteps Array with the isSaved values for each of the steps.
 *
 * @returns {int} The index to expand.
 */
export function getInitialActiveStepIndex( isSavedSteps ) {
	// If anything other than an array has been provided, or it is an empty array, return 0.
	if ( ! Array.isArray( isSavedSteps ) || isSavedSteps.length === 0 ) {
		return 0;
	}

	// Get the index of the first element that has not been saved yet.
	const index = isSavedSteps.findIndex( ( element ) => element === false );
	if ( index !== -1 ) {
		return index;
	}

	// If all steps have been finished, return the index of the last step.
	if ( isSavedSteps.every( Boolean ) ) {
		return isSavedSteps.length - 1;
	}

	return 0;
}
