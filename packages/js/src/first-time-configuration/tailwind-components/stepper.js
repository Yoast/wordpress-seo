import { createContext, Fragment, useCallback, useContext, useEffect, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import classNames from "classnames";
import PropTypes from "prop-types";
import AnimateHeight from "react-animate-height";
import { stepperTimingClasses, stepperTimings } from "../stepper-helper";
import { FadeInAlert } from "../tailwind-components/base/alert";
import StepHeader from "./step-header";

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
 * The component button used to navigate the steps.
 *
 * @param {function} [beforeGo=null] A function to call when the button is clicked.
 * @param {React.ReactNode} [children] The children of the component.
 * @param {number|string} [destination=1] A number of steps to take relative to the current step or "first" or "last".
 * @param {...Object} [restProps] Additional properties to pass to the button.
 *
 * @returns {JSX.Element} The button element.
 */
function GoButton( {
	beforeGo = null,
	children = <Fragment>{ __( "Continue", "wordpress-seo" ) }</Fragment>,
	destination = 1,
	...restProps
} ) {
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

	return <Button
		onClick={ goFunction }
		{ ...restProps }
	>
		{ children }
	</Button>;
}

GoButton.propTypes = {
	beforeGo: PropTypes.func,
	children: PropTypes.node,
	destination: PropTypes.oneOfType( [
		PropTypes.number,
		PropTypes.oneOf( [ "first", "last" ] ),
	] ),
};

/**
 * The StepButtons component.
 *
 * @param {React.ReactNode} [children] The children of the component.
 * @param {...Object} [restProps] Additional properties to pass to the button.
 * @returns {JSX.Element} The EditButton component.
 */
function EditButton( {
	children = <Fragment>{ __( "Edit", "wordpress-seo" ) }</Fragment>,
	...restProps
} ) {
	const { stepIndex, setActiveStepIndex } = useStepperContext();

	const editFunction = useCallback( () => {
		setActiveStepIndex( stepIndex );
	}, [ setActiveStepIndex, stepIndex ] );

	return <Button
		onClick={ editFunction }
		variant="secondary"
		size="small"
		{ ...restProps }
	>
		{ children }
	</Button>;
}

EditButton.propTypes = {
	children: PropTypes.node,
};

/**
 * The Step Element.
 *
 * @param {React.ReactNode} children The children of the component.
 *
 * @returns {JSX.Element} The Step.
 */
export function Step( { children } ) {
	const { lastStepIndex, stepIndex, activeStepIndex } = useStepperContext();
	return <Fragment>
		{ /* Line. */ }
		{ stepIndex !== lastStepIndex &&
			<Fragment>
				<div
					className={ "yst--ms-px yst-absolute yst-start-4 yst-w-0.5 yst-h-full yst-bg-slate-300 yst--bottom-6" }
					aria-hidden="true"
				/>
				<div
					className={ classNames(
						"yst-h-12 yst-transition-transform yst-ease-linear",
						delayUntilStepFaded,
						slideDurationClass,
						stepIndex < activeStepIndex ? "yst-scale-y-1" : "yst-scale-y-0",
						"yst-origin-top yst--ms-px yst-absolute yst-start-4 yst-w-0.5 yst-bg-primary-500 yst-top-8"
					) }
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
 * Provides a way to provide error messages at the Step level.
 *
 * @param {string} id The id for the error.
 * @param {string} message The error message.
 * @param {string} [className=""] The class name for the error.
 *
 * @returns {JSX.Element} The StepError component.
 */
export function StepError( { id, message, className = "" } ) {
	return <FadeInAlert
		id={ id }
		type="error"
		isVisible={ !! message }
		className={ className }
	>
		{
			sprintf(
				/* translators: %1$s expands to the error message returned by the server */
				__(
					"An error has occurred: %1$s",
					"wordpress-seo"
				),
				message
			)
		}
	</FadeInAlert>;
}

StepError.propTypes = {
	id: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	className: PropTypes.string,
};

/**
 * The (Tailwind) Step component.
 *
 * @param {React.ReactNode} children The children.
 *
 * @returns {JSX.Element} The Step component.
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
				id={ `content-${ stepIndex }` }
				delay={ contentHeight === 0 ? delayBeforeClosing : delayBeforeOpening }
				height={ contentHeight }
				easing="ease-in-out"
				duration={ slideDuration }
			>
				<div
					className={ classNames(
						"yst-transition-opacity yst-relative yst-ms-12 yst-mt-4 yst-pb-1",
						fadeDuration,
						isFaded ? "yst-opacity-0 yst-pointer-events-none" : "yst-opacity-100"
					) }
				>
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
 * @param {function} setActiveStepIndex The function to set the active step index.
 * @param {number} activeStepIndex The active step index.
 * @param {boolean} [isStepperFinished=false] Whether the stepper is finished.
 * @param {React.ReactNode} children The stepper steps.
 *
 * @returns {JSX.Element} The Stepper.
 */
export default function Stepper( {
	children,
	setActiveStepIndex,
	activeStepIndex,
	isStepperFinished = false,
} ) {
	return (
		<ol>
			{ children.map( ( child, stepIndex ) => {
				return <li
					key={ `${ child.props.name }-${ stepIndex }` }
					className={ ( stepIndex === children.length - 1 ? "" : "yst-pb-8" ) + " yst-mb-0 yst-relative yst-max-w-none" }
				>
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

Step.Content = Content;
Step.Error = StepError;
Step.Header = StepHeader;
Step.GoButton = GoButton;
Step.EditButton = EditButton;
