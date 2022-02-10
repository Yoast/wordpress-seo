import { Fragment, useCallback, useState, useEffect, useContext, createContext } from "@wordpress/element";
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


const StepperContext = createContext();

function useStepperContext() {
	const context = useContext( StepperContext );
	if ( ! context ) {
	  throw new Error(
			"Stepper compound components cannot be rendered outside the Stepper component"
	  );
	}
	return context;
}

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
function StepButtons( { continueFunction, backFunction, continueLabel, backLabel } ) {
	const { stepIndex, setActiveStepIndex, lastStepIndex } = useStepperContext();

	const forwardFunction = useCallback( async() => {
		if ( continueFunction ) {
			await continueFunction();
		}
		setActiveStepIndex( stepIndex + 1 );
	}, [ setActiveStepIndex, stepIndex, continueFunction ] );

	const backwardFunction = useCallback( async() => {
		if ( backFunction ) {
			await backFunction();
		}
		setActiveStepIndex( stepIndex - 1 );
	}, [ setActiveStepIndex, stepIndex, continueFunction ] );

	return <div className="yst-mt-12">
		{ stepIndex !== lastStepIndex && <button
			onClick={ forwardFunction }
			className="yst-button--primary"
		>
			{ continueLabel }
		</button> }
		{ ( stepIndex > 0 && backFunction ) && <button
			onClick={ backwardFunction }
			className="yst-button--secondary yst-ml-3"
		>
			{ backLabel }
		</button>
		}
	</div>;
}

StepButtons.propTypes = {
	continueFunction: PropTypes.func,
	backFunction: PropTypes.func,
	continueLabel: PropTypes.string,
	backLabel: PropTypes.string,
};

StepButtons.defaultProps = {
	continueFunction: null,
	backFunction: null,
	continueLabel: __( "Save and continue", "wordpress-seo" ),
	backLabel: __( "Go back", "wordpress-seo" ),
};

/**
 * The (Tailwind) Step component
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Step component.
 */
export function TailwindStep( { name, description, isSaved, beforeContinue, children } ) {
	const { activeStepIndex, stepIndex, setActiveStepIndex, lastStepIndex, showEditButton, isStepBeingEdited, setIsStepBeingEdited } = useStepperContext();
	const isLastStep = stepIndex === lastStepIndex;
	const isActiveStep = activeStepIndex === stepIndex;

	const [ contentHeight, setContentHeight ] = useState( isActiveStep ? "auto" : 0 );
	const [ isFaded, setIsFaded ] = useState( ! isActiveStep );

	const saveEditedStep = useCallback(
		() => {
			const canContinueToNextStep = beforeContinue();
			if ( canContinueToNextStep === true ) {
				setIsStepBeingEdited( false );
				setActiveStepIndex( lastStepIndex );
			}
		},
		[ beforeContinue, stepIndex, setActiveStepIndex, setIsStepBeingEdited ]
	);

	const saveAndContinue = useCallback(
		() => {
			const continueToNextStep = beforeContinue();
			if ( continueToNextStep === true ) {
				setActiveStepIndex( stepIndex + 1 );
			}
		},
		[ setActiveStepIndex, beforeContinue, stepIndex ]
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
		setIsStepBeingEdited( true );
	}, [ stepIndex, setActiveStepIndex, setIsStepBeingEdited ] );

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
				name={ name }
				description={ description }
				isActiveStep={ isActiveStep }
				isSaved={ isSaved }
				isLastStep={ isLastStep }
				showEditButton={ showEditButton }
				editStep={ editStep }
				isStepBeingEdited={ isStepBeingEdited }
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
					{ children }
				</div>
			</AnimateHeight>
		</Fragment>
	);
}
TailwindStep.propTypes = {
	name: PropTypes.string.isRequired,
	isSaved: PropTypes.bool.isRequired,
	children: PropTypes.node.isRequired,
	beforeContinue: PropTypes.func,
	description: PropTypes.string,
};
TailwindStep.defaultProps = {
	description: "",
	beforeContinue: () => true,
};

/**
 * The Tailwind Stepper component.
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Stepper component.
 */
export default function Stepper( { children, setActiveStepIndex, activeStepIndex, isStepperFinished } ) {
	const [ isStepBeingEdited, setIsStepBeingEdited ] = useState( false );
	const [ showEditButton, setShowEditButton ] = useState( isStepperFinished );
	// The stepper needs to signal to each step to not to show edit buttons when a step is being edited (needs a function here to pass to each tailwindstep)

	useEffect( () => {
		if ( isStepperFinished ) {
			setShowEditButton( isStepperFinished );
		}
	}, [ isStepperFinished ] );

	return (
		<ol>
			{ children.map( ( child, stepIndex ) => {
				return <li key={ `${ child.props.name }-${ stepIndex }` } className={ ( stepIndex === children.length - 1 ? "" : "yst-pb-8" ) + " yst-mb-0 yst-relative" }>
					<StepperContext.Provider value={ { stepIndex, activeStepIndex, setActiveStepIndex, lastStepIndex: children.length - 1, isStepBeingEdited, setIsStepBeingEdited, showEditButton } }>
						{ child }
					</StepperContext.Provider>
				</li>;
			} ) }
		</ol>
	);
}

Stepper.propTypes = {
	setActiveStepIndex: PropTypes.func.isRequired,
	activeStepIndex: PropTypes.number.isRequired,
	isStepperFinished: PropTypes.bool.isRequired,
	children: PropTypes.node.isRequired,
};

Stepper.Step = TailwindStep;
Stepper.Buttons = StepButtons;
/* eslint-enable complexity, max-len */
