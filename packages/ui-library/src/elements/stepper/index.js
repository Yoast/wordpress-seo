import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef, useRef, useEffect, useState, useCallback } from "react";
import { CheckIcon } from "@heroicons/react/solid";

/**
 * Step component.
 *
 * @param {string} label The step label.
 * @param {number} index The step index.
 * @param {boolean} isComplete Is the step complete.
 * @param {number} currentStep The current step.
 * @param {function} addStepRef The function to add the step ref.
 *
 * @returns {JSX.Element} The step element.
 */
const Step = ( { label, index, isComplete, currentStep, addStepRef } ) => {
	const handleRef = useCallback( ( el ) =>{
		addStepRef( el, index );
	}, [] );
	return (
		<div
			ref={ handleRef }
			className={ classNames( "yst-step",
				currentStep > index + 1 || isComplete ? "yst-step--complete" : "",
				currentStep === index + 1 ? "yst-step--active" : "" ) }
		>
			<div className="yst-step__circle">
				{ ( currentStep > index + 1 || isComplete ) && <CheckIcon
					className="yst-step__icon yst-w-4 yst-z-50"
				/> }

				<div
					className={
						classNames( "yst-step__icon yst-bg-primary-500 yst-w-2 yst-h-2 yst-rounded-full yst-delay-500",
							! isComplete && currentStep === index + 1 ? "yst-opacity-100" : "yst-opacity-0" ) }
				/>
			</div>
			<div className="yst-font-semibold yst-text-xxs yst-mt-3">{ label }</div>
		</div>
	);
};

Step.propTypes = {
	label: PropTypes.string.isRequired,
	index: PropTypes.number.isRequired,
	isComplete: PropTypes.bool.isRequired,
	currentStep: PropTypes.number.isRequired,
	addStepRef: PropTypes.func.isRequired,
};

/**
 *
 * @param {number} currentStep The currrent step.
 * @param {boolean} isComplete Is the step complete.
 * @param {array} steps The steps names.
 * @param {string} [className] Optional extra className.
 * @returns {JSX.Element} The Stepper element.
 */
const Stepper = forwardRef( ( { currentStep, isComplete, steps, className = "" }, ref ) => {
	const [ margins, setMargins ] = useState( {
		marginLeft: 0,
		marginRight: 0,
	} );
	const stepRef = useRef( [] );

	useEffect( () => {
		setMargins( {
			marginLeft: stepRef.current[ 0 ].offsetWidth / 2,
			marginRight: stepRef.current[ steps.length - 1 ].offsetWidth / 2,
		} );
	}, [ stepRef, steps.length ] );

	if ( ! steps.length ) {
		return <></>;
	}

	const calculateProgressBarWidth = () => {
		return ( ( currentStep - 1 ) / ( steps.length - 1 ) ) * 100;
	};

	const addStepRef = useCallback( ( el, index ) => ( stepRef.current[ index ] = el ), [ stepRef ] );

	return (
		<div className={ classNames( className, "yst-stepper" ) } ref={ ref }>
			{ steps.map( ( step, index ) => <Step
				key={ step.label }
				label={ step.label }
				currentStep={ currentStep }
				isComplete={ isComplete }
				index={ index }
				addStepRef={ addStepRef }
			/> ) }

			{ /* Progress bar */ }
			<div
				className="yst-absolute yst-top-3 yst-left-0 yst-h-0.5 yst-bg-slate-300"
				style={ {
					width: `calc(100% - ${ margins.marginLeft +
                                    margins.marginRight }px)`,
					marginLeft: margins.marginLeft,
					marginRight: margins.marginRight,
				} }
			>

				{ /* Progress */ }
				<div
					className="yst-h-full yst-transition-all yst-ease-in yst-duration-500 yst-bg-primary-500"
					style={ { width: `${ calculateProgressBarWidth() }%` } }
				/>
			</div>
		</div>

	);
} );

Stepper.displayName = "Stepper";
Stepper.propTypes = {
	currentStep: PropTypes.number.isRequired,
	isComplete: PropTypes.bool.isRequired,
	steps: PropTypes.arrayOf( PropTypes.shape( {
		label: PropTypes.string,
	} ) ).isRequired,
	className: PropTypes.string,
};
Stepper.defaultProps = {
	className: "",
};

export default Stepper;
