import { StepCircle } from "./StepCircle";
import PropTypes from "prop-types";
import { stepperTimings } from "../stepper-helper";
import { useStepperContext } from "./Stepper";

/* eslint-disable complexity */

/**
 * Gets the classnames for the step name.
 *
 * @param {boolean} isFinished   Whether the step is finished.
 * @param {boolean} isActiveStep Whether the step is active.
 * @param {boolean} isLastStep   Whether it is the last step.
 *
 * @returns {string} The classnames for the step name.
 */
function getNameClassnames( isFinished, isActiveStep, isLastStep ) {
	if ( isActiveStep && ! isLastStep ) {
		return "yst-text-primary-500";
	}
	return isFinished ? "" : "yst-text-gray-500";
}

/* eslint-disable complexity */
/**
 * The Step header component.
 *
 * @param {Object}   props                   The props object.
 * @param {Object}   props.step              An object representing a step.
 * @param {boolean}  props.isActiveStep      Whether the step is active.
 * @param {boolean}  props.isFinished        Whether the step is finished.
 * @param {boolean}  props.isLastStep        Whether it is the last step.
 * @param {boolean}  props.isStepBeingEdited Whether the step is being open for editing or not.
 * @param {boolean}  props.showEditButton    Whether to show the edit button or not.
 * @param {function} props.editStep          A function to call when the "Edit" button is pressed.
 *
 * @returns {WPElement} The StepHeader component.
 */
export default function StepHeader( { name, description, isFinished, children } ) {
	const { stepIndex, activeStepIndex, lastStepIndex } = useStepperContext();
	const isActiveStep = activeStepIndex === stepIndex;
	const isLastStep = lastStepIndex === stepIndex;
	const nameClassNames = getNameClassnames( isFinished, isActiveStep, isLastStep );

	return <div className="yst-relative yst-flex yst-items-center yst-group" aria-current={ isActiveStep ? "step" : null }>
		<span className="yst-flex yst-items-center" aria-hidden={ isActiveStep ? "true" : null }>
			<StepCircle
				activationDelay={ stepperTimings.delayBeforeOpening }
				deactivationDelay={ 0 }
				isFinished={ isFinished }
			/>
		</span>
		{ /* Name and description. */ }
		<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col">
			<span className={ "yst-text-xs yst-font-[650] yst-tracking-wide yst-uppercase " + nameClassNames }>
				{ name }
			</span>
			{ description && <span className="yst-text-sm yst-text-gray-500">{ description }</span> }
		</span>
		{ children }
	</div>;
}

StepHeader.propTypes = {
	name: PropTypes.string.isRequired,
	isFinished: PropTypes.bool.isRequired,
	description: PropTypes.string,
	children: PropTypes.node,
};

StepHeader.defaultProps = {
	description: "",
	children: [],
};

/* eslint-enable complexity */
