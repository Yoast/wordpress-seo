import { ProgressBar as PureProgressBar } from "../../index";
import React from "react";
import propTypes from "prop-types";

/**
 * The ProgressBar component for the Stepper.
 *
 * @param {React.ElementType} as The component to use for the progress bar.
 * @returns {JSX.Element} The ProgressBar component.
 */
export const StepperProgressBar = ( { as: Component = PureProgressBar, ...props } ) => (
	<Component
		className="yst-absolute yst-top-3 yst-w-auto yst-h-0.5"
		min={ 0 }
		max={ 100 }
		{ ...props }
	/>
);

StepperProgressBar.propTypes = {
	as: propTypes.elementType,
};
StepperProgressBar.displayName = "Stepper.ProgressBar";
