import propTypes from "prop-types";
import React from "react";
import { ProgressBar } from "../../index";

/**
 * The ProgressBar component for the Stepper.
 *
 * @param {React.ElementType} [as=ProgressBar] The component to use for the progress bar.
 *
 * @returns {JSX.Element} The ProgressBar.
 */
export const StepperProgressBar = ( { as: Component = ProgressBar, ...props } ) => (
	<Component
		className="yst-absolute yst-top-3 yst-w-auto yst-h-0.5"
		min={ 0 }
		max={ 100 }
		{ ...props }
	/>
);

StepperProgressBar.displayName = "Stepper.ProgressBar";
StepperProgressBar.propTypes = {
	as: propTypes.elementType,
};
