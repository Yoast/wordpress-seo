import { Fragment, useCallback, useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import AnimateHeight from "react-animate-height";
import PropTypes from "prop-types";
import { stepperTimings, stepperTimingClasses } from "../stepper-helper";
import StepHeader from "./StepHeader";

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
function TailwindStep( { step, stepIndex, isLastStep, saveStep, activeStepIndex, setActiveStepIndex, showEditButton } ) {
	const isActiveStep = activeStepIndex === stepIndex;
	const isSaved = step.isSaved;

	const [ contentHeight, setContentHeight ] = useState( isActiveStep ? "auto" : 0 );
	const [ isFaded, setIsFaded ] = useState( ! isActiveStep );

	const saveEditedStep = useCallback(
		() => {
			saveStep( stepIndex );
			// Expand the last step?
		},
		[ saveStep, stepIndex ]
	);

	const continueToNextStep = useCallback(
		() => {
			setActiveStepIndex( stepIndex + 1 );
		},
		[ setActiveStepIndex, stepIndex ]
	);

	const saveAndContinue = useCallback(
		() => {
			saveEditedStep();
			continueToNextStep();
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

	const editStep = useCallback( () => {
		setActiveStepIndex( stepIndex );
	}, [ stepIndex, setActiveStepIndex ] );

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

			<StepHeader
				step={ step }
				isActiveStep={ isActiveStep }
				isSaved={ isSaved }
				isLastStep={ isLastStep }
				showEditButton={ showEditButton }
				editStep={ editStep }
			/>

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
					{ ( ! isLastStep && ! showEditButton ) &&
						<StepButtons
							stepIndex={ stepIndex }
							saveAndContinue={ saveAndContinue }
							goBack={ goBack }
						/>
					}
					{ ( ! isLastStep && showEditButton ) &&
						<button
							className="yst-button--primary"
							onClick={ saveEditedStep }
						>
							Save Changes
						</button>
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
	showEditButton: PropTypes.bool,
};
TailwindStep.defaultProps = {
	saveStep: () => { },
	showEditButton: false,
};

/**
 * The Tailwind Stepper component.
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Stepper component.
 */
export default function Stepper( { steps, setActiveStepIndex, saveStep, activeStepIndex, isStepperFinished } ) {
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
						showEditButton={ isStepperFinished }
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
	isStepperFinished: PropTypes.bool.isRequired,
};
Stepper.defaultProps = {
	saveStep: () => { },
};
/* eslint-enable complexity, max-len */
