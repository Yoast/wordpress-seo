import { Fragment, useCallback, useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import AnimateHeight from "react-animate-height";
import PropTypes from "prop-types";
import { StepCircle } from "./StepCircle";
import { stepperTimings, stepperTimingClasses } from "../stepper-helper";

/* eslint-disable complexity, max-len */
const {
	slideDuration,
	delayBeforeOpening,
	delayBeforeFadingIn,
	delayBeforeClosing,
} = stepperTimings;

const { fadeDuration, delayUntilStepFaded, slideDurationClass = slideDuration } = stepperTimingClasses;

/**
 * The StepButtons component.
 *
 * @param {Object}   props                 The props object.
 * @param {number}   props.stepIndex       The index of the current step.
 * @param {function} props.saveAndContinue A function to call when the primary button is clicked.
 * @param {function} props.goBack          A function to call when the "Go Back" button is clicked.
 *
 * @returns {WPElement} The StepButtons component.
 */
function StepButtons( { stepIndex, saveAndContinue, goBack } ) {
	return <div className="yst-mt-12">
		<button
			onClick={ saveAndContinue }
			className="yst-button--primary"
		>
			{ __( "Save and continue", "wordpress-seo" ) }
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
	saveAndContinue: PropTypes.func.isRequired,
	goBack: PropTypes.func.isRequired,
};

/**
 * Gets the classnames for the step name.
 *
 * @param {boolean} isSaved      Whether the step is saved.
 * @param {boolean} isActiveStep Whether the step is active.
 * @param {boolean} isLastStep   Whether it is the last step.
 *
 * @returns {string} The classnames for the step name.
 */
function getNameClassnames( isSaved, isActiveStep, isLastStep ) {
	if ( isActiveStep && ! isLastStep ) {
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
 * The (Tailwind) Step component
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Step component.
 */
function TailwindStep( { step, stepIndex, isLastStep, saveStep, activeStepIndex, setActiveStepIndex } ) {
	const isActiveStep = activeStepIndex === stepIndex;
	const isSaved = step.isSaved;
	const nameClassNames = getNameClassnames( isSaved, isActiveStep, isLastStep );

	const [ contentHeight, setContentHeight ] = useState( isActiveStep ? "auto" : 0 );
	const [ isFaded, setIsFaded ] = useState( ! isActiveStep );

	const saveAndContinue = useCallback(
		() => {
			saveStep( stepIndex );
			setActiveStepIndex( stepIndex + 1 );
		},
		[ setActiveStepIndex, saveStep, stepIndex ]
	);

	const goBack = useCallback( () => {
		setActiveStepIndex( stepIndex - 1 );
	}, [ stepIndex, setActiveStepIndex ] );

	useEffect( () => {
		if ( isActiveStep ) {
			setContentHeight( "auto" );
			// Wait until all other animations are done.
			setTimeout( () => setIsFaded( false ), delayBeforeFadingIn );
		} else {
			setIsFaded( true );
			setContentHeight( 0 );
		}
	}, [ isActiveStep ] );

	return (
		<Fragment>
			{ /* Line. */ }
			{ ! isLastStep &&
				<Fragment>
					<div
						className={ "yst--ml-px yst-absolute yst-left-4 yst-w-0.5 yst-h-full yst-bg-gray-300 yst--bottom-6" }
						aria-hidden="true"
					/>
					<div
						className={ `yst-h-12 yst-transition-transform ${ delayUntilStepFaded } yst-ease-linear ${ slideDurationClass } ${ stepIndex < activeStepIndex  ? "yst-scale-y-1" : "yst-scale-y-0" } yst-origin-top yst--ml-px yst-absolute yst-left-4 yst-w-0.5 yst-bg-primary-500 yst-top-8` }
						aria-hidden="true"
					/>
				</Fragment>
			}
			{ /* Bullet. */ }
			<div className="yst-relative yst-flex yst-items-start yst-group" aria-current={ isActiveStep ? "step" : null }>
				<span className="yst-flex yst-items-center" aria-hidden={ isActiveStep ? "true" : null }>
					<StepCircle
						isActive={ isActiveStep }
						isSaved={ isSaved }
						isLastStep={ isLastStep }
						activationDelay={ delayBeforeOpening }
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
				delay={ contentHeight === 0 ? delayBeforeClosing : delayBeforeOpening }
				height={ contentHeight }
				easing="ease-in-out"
				duration={ slideDuration }
			>
				<div className={ `yst-transition-opacity ${ fadeDuration } yst-relative yst-ml-12 yst-mt-4 ${ isFaded ? "yst-opacity-0 yst-no-point-events" : "yst-opacity-100" }` }>
					{ step.component }
					{ ! isLastStep &&
						<StepButtons
							stepIndex={ stepIndex }
							saveAndContinue={ saveAndContinue }
							goBack={ goBack }
						/>
					}
				</div>
			</AnimateHeight>
		</Fragment>
	);
}
TailwindStep.propTypes = {
	step: stepShape.isRequired,
	stepIndex: PropTypes.number.isRequired,
	isLastStep: PropTypes.bool.isRequired,
	setActiveStepIndex: PropTypes.func.isRequired,
	saveStep: PropTypes.func,
	activeStepIndex: PropTypes.number.isRequired,
};
TailwindStep.defaultProps = {
	saveStep: () => { },
};

/**
 * The Tailwind Stepper component.
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Stepper component.
 */
export default function Stepper( { steps, setActiveStepIndex, saveStep, activeStepIndex } ) {
	return (
		<ol className="yst-overflow-hidden">
			{ steps.map( ( step, stepIndex ) => (
				<li key={ step.name } className={ ( stepIndex === steps.length - 1 ? "" : "yst-pb-8" ) + " yst-mb-0 yst-relative" }>
					<TailwindStep
						step={ step }
						stepIndex={ stepIndex }
						isLastStep={ stepIndex === steps.length - 1 }
						setActiveStepIndex={ setActiveStepIndex }
						saveStep={ saveStep }
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
	activeStepIndex: PropTypes.number.isRequired,
};
Stepper.defaultProps = {
	saveStep: () => { },
};
/* eslint-enable complexity, max-len */
