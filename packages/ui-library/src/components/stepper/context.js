import { noop } from "lodash";
import { createContext } from "react";

/**
 * Context for the stepper. Used to add a reference to the step.
 */
export const StepperContext = createContext( {
	addStepRef: noop,
	currentStep: 0,
} );
