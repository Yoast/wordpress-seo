
import classNames from "classnames";
import { CheckIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import { Stepper } from ".";

/**
 * Custom step component for stepper story.
 *
 * @param {JSX.Node} children The step label or children.
 * @param {boolean} isComplete Is the step complete.
 * @param {boolean} isActive Is the step
 *
 * @returns {JSX.Element} The step element.
 */
export const CustomStep = ( { children, isComplete, isActive } ) => {
	const { addStepRef } = useContext( Stepper.Context );
	return (
		<div
			ref={ addStepRef }
			className={ classNames( "yst-step",
				isComplete ? "yst-step--complete" : "",
				isActive ? "yst-step--active yst-text-green-700" : "" ) }
		>
			<div
				className={ classNames( "yst-step__circle yst-ring-green-500",
					isComplete ? "yst-bg-green-500 yst-ring-green-500" : "yst-bg-white",
				) }
			>
				{ isComplete && <CheckIcon
					className="yst-step__icon yst-w-4 yst-z-50"
				/> }

				<div
					className={
						classNames( "yst-step__icon yst-bg-green-500 yst-w-2 yst-h-2 yst-rounded-full yst-delay-500",
							! isComplete && isActive ? "yst-opacity-100" : "yst-opacity-0" ) }
				/>
			</div>
			<div className="yst-font-semibold yst-text-xxs yst-mt-3">{ children }</div>
		</div>
	);
};

CustomStep.displayName = "CustomStep";
CustomStep.propTypes = {
	children: PropTypes.node.isRequired,
	isActive: PropTypes.bool.isRequired,
	isComplete: PropTypes.bool.isRequired,
};
