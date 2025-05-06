import { CheckIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import { StepperContext } from "./context";

/**
 * Step component.
 *
 * @param {JSX.Node} children The step label or children.
 * @param {number} index The index of the step.
 *
 * @returns {JSX.Element} The step element.
 */
export const Step = ( { children, index, id } ) => {
	const { addStepRef, currentStep } = useContext( StepperContext );
	const isActive = index === currentStep;
	const isComplete = index < currentStep;

	return (
		<div
			ref={ addStepRef }
			className={ classNames(
				"yst-step",
				isComplete && "yst-step--complete",
				isActive && "yst-step--active",
			) }
			id={ id }
		>
			<div className="yst-step__circle">
				{ isComplete && <CheckIcon
					className="yst-step__icon yst-w-4"
				/> }

				<div
					className={
						classNames( "yst-step__icon yst-bg-primary-500 yst-w-2 yst-h-2 yst-rounded-full yst-delay-500",
							! isComplete && isActive ? "yst-opacity-100" : "yst-opacity-0" ) }
				/>
			</div>
			<div className="yst-font-semibold yst-text-xxs yst-mt-3">{ children }</div>
		</div>
	);
};

Step.displayName = "Stepper.Step";
Step.propTypes = {
	children: PropTypes.node.isRequired,
	index: PropTypes.number.isRequired,
	id: PropTypes.string.isRequired,
};
