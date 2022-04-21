import { Fragment, useCallback, useState, useEffect, useContext, createContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import AnimateHeight from "react-animate-height";
import PropTypes from "prop-types";
import { stepperTimings, stepperTimingClasses } from "../stepper-helper";
import StepHeader from "./StepHeader";

/* eslint-disable complexity */
const {
	slideDuration,
	delayBeforeOpening,
	delayBeforeFadingIn,
	delayBeforeClosing,
} = stepperTimings;

const { fadeDuration, delayUntilStepFaded, slideDuration: slideDurationClass } = stepperTimingClasses;

const StepperContext = createContext();

/**
 * A hook for getting the StepperContext value, with an informative error message.
 *
 * @returns {*} The value provided to the StepperContext provider.
 */
export function useStepperContext() {
	const context = useContext( StepperContext );
	if ( ! context ) {
	  throw new Error(
			"Stepper compound components cannot be rendered outside the Stepper component"
	  );
	}
	return context;
}

/**
 * The component button used to navigate the steps
 *
 * @param {Object}     props             The props object.
 * @param {number}     props.children    The children of the component.
 * @param {function}   props.beforeGo    A function to call when the button is clicked.
 * @param {int|string} props.destination A number of steps to take relative to the current step or "first" or "last".
 *
 * @returns {WPElement} The button element.
 */
function GoButton( { beforeGo, children, destination, ...restProps } ) {
	const { stepIndex, setActiveStepIndex, lastStepIndex } = useStepperContext();
	const goToDestination = useCallback( () => {
		if ( typeof destination === "string" ) {
			setActiveStepIndex( destination === "last" ? lastStepIndex : 0 );
		} else {
			setActiveStepIndex( stepIndex + destination );
		}
	}, [ stepIndex, lastStepIndex, setActiveStepIndex, destination ] );

	const goFunction = useCallback( async() => {
		let canGo = true;
		if ( beforeGo ) {
			canGo = false;
			canGo = await beforeGo();
		}
		if ( canGo ) {
			goToDestination();
		}
	}, [ goToDestination, beforeGo ] );

	return <button
		onClick={ goFunction }
		{ ...restProps }
	>
		{ children }
	</button>;
}

GoButton.propTypes = {
	beforeGo: PropTypes.func,
	children: PropTypes.node,
	destination: PropTypes.oneOfType( [
		PropTypes.number,
		PropTypes.oneOf( [ "first", "last" ] ),
	] ),
};

GoButton.defaultProps = {
	beforeGo: null,
	children: <Fragment>{ __( "Continue", "wordpress-seo" ) }</Fragment>,
	destination: 1,
};

/**
 * The StepButtons component.
 *
 * @param {Object}   props The props object.
 *
 * @returns {WPElement} The EditButton component.
 */
function EditButton( { children, ...restProps } ) {
	const { stepIndex, setActiveStepIndex } = useStepperContext();

	const editFunction = useCallback( () => {
		setActiveStepIndex( stepIndex );
	}, [ setActiveStepIndex, stepIndex ] );

	return <button
		onClick={ editFunction }
		className="yst-button yst-button--secondary yst-button--small"
		{ ...restProps }
	>
		{ children }
	</button>;
}

EditButton.propTypes = {
	children: PropTypes.node,
};

EditButton.defaultProps = {
	children: <Fragment>{ __( "Edit", "wordpress-seo" ) }</Fragment>,
};

/**
 * The Step Element
 *
 * @param {Object} props            The props object.
 * @param {Node}   props.children   The children of the component.
 *
 * @returns {WPElement} The Step
 */
export function Step( { children } ) {
	const { lastStepIndex, stepIndex, activeStepIndex } = useStepperContext();
	return <Fragment>
		{ /* Line. */ }
		{ stepIndex !== lastStepIndex &&
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
		{ children }
	</Fragment>;
}

Step.propTypes = {
	children: PropTypes.node.isRequired,
};

/**
 * The (Tailwind) Step component
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Step component.
 */
function Content( { children } ) {
	const { activeStepIndex, stepIndex } = useStepperContext();
	const isActiveStep = activeStepIndex === stepIndex;

	const [ contentHeight, setContentHeight ] = useState( isActiveStep ? "auto" : 0 );
	const [ isFaded, setIsFaded ] = useState( ! isActiveStep );

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
			{ /* Child component and buttons. */ }
			<AnimateHeight
				id={ `content-${stepIndex}` }
				delay={ contentHeight === 0 ? delayBeforeClosing : delayBeforeOpening }
				height={ contentHeight }
				easing="ease-in-out"
				duration={ slideDuration }
			>
				<div className={ `yst-transition-opacity ${ fadeDuration } yst-relative yst-ml-12 yst-mt-4 yst-pb-1 ${ isFaded ? "yst-opacity-0 yst-pointer-events-none" : "yst-opacity-100" }` }>
					{ children }
				</div>
			</AnimateHeight>
		</Fragment>
	);
}

Content.propTypes = {
	children: PropTypes.node.isRequired,
};

/**
 * The Tailwind Stepper component.
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Stepper component.
 */
export default function Stepper( { children, setActiveStepIndex, activeStepIndex, isStepperFinished } ) {
	return (
		<ol>
			{ children.map( ( child, stepIndex ) => {
				return <li key={ `${ child.props.name }-${ stepIndex }` } className={ ( stepIndex === children.length - 1 ? "" : "yst-pb-8" ) + " yst-mb-0 yst-relative" }>
					<StepperContext.Provider
						value={ { stepIndex, activeStepIndex, setActiveStepIndex, lastStepIndex: children.length - 1, isStepperFinished } }
					>
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
	isStepperFinished: PropTypes.bool,
	children: PropTypes.node.isRequired,
};

Stepper.defaultProps = {
	isStepperFinished: false,
};

Step.Content = Content;
Step.Header = StepHeader;
Step.GoButton = GoButton;
Step.EditButton = EditButton;
/* eslint-enable complexity */
