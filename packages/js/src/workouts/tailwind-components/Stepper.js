import { Fragment, useCallback, useState, useEffect, Children, cloneElement, createContext } from "@wordpress/element";
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
	beforeContinue: PropTypes.func,
} );

/**
 * The (Tailwind) Step component
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Step component.
 */
export function TailwindStep( { name, description, isSaved, stepIndex, lastStepIndex, isLastStep, beforeContinue, activeStepIndex, setActiveStepIndex, showEditButton, isStepBeingEdited, setIsStepBeingEdited, children } ) {
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
					{ ( ! isLastStep && ! showEditButton ) &&
						<StepButtons
							stepIndex={ stepIndex }
							saveAndContinue={ saveAndContinue }
							goBack={ goBack }
						/>
					}
					{ ( ! isLastStep && showEditButton ) &&
						<button
							className="yst-button--primary yst-mt-12"
							onClick={ saveEditedStep }
						>
							{ __( "Save Changes", "wordpress-seo" ) }
						</button>
					}
				</div>
			</AnimateHeight>
		</Fragment>
	);
}
TailwindStep.propTypes = {
	name: PropTypes.string.isRequired,
	isSaved: PropTypes.bool.isRequired,
	stepIndex: PropTypes.number.isRequired,
	lastStepIndex: PropTypes.number.isRequired,
	isLastStep: PropTypes.bool.isRequired,
	setActiveStepIndex: PropTypes.func.isRequired,
	beforeContinue: PropTypes.func,
	activeStepIndex: PropTypes.number.isRequired,
	description: PropTypes.string,
	showEditButton: PropTypes.bool,
	setIsStepBeingEdited: PropTypes.func.isRequired,
	isStepBeingEdited: PropTypes.bool.isRequired,
};
TailwindStep.defaultProps = {
	description: "",
	showEditButton: false,
	beforeContinue: () => true,
};

const ActiveStepContext = createContext();

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
	const childrenArray = Children.toArray( children );

	return (
		<ol className="yst-overflow-hidden">
			{ Children.map( childrenArray, ( child, stepIndex ) => {
				console.log( child.props );
				return <li key={ `${ child.props.name }-${ stepIndex }` } className={ ( stepIndex === children.length - 1 ? "" : "yst-pb-8" ) + " yst-mb-0 yst-relative" }>
					{ cloneElement( child, {
						stepIndex,
						setActiveStepIndex,
						activeStepIndex,
						isStepBeingEdited,
						setIsStepBeingEdited,
						showEditButton,
						setShowEditButton,
					} ) }
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
/* eslint-enable complexity, max-len */
