import { StepCircle } from "./StepCircle";
import PropTypes from "prop-types";
import { stepperTimings, stepperTimingClasses } from "../stepper-helper";

/* eslint-disable complexity, max-len */

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
export default function StepHeader( { name, description, isActiveStep, isFinished, isLastStep, isStepBeingEdited, showEditButton, editStep } ) {
	const nameClassNames = getNameClassnames( isFinished, isActiveStep, isLastStep );

	return <div className="yst-relative yst-flex yst-items-center yst-group" aria-current={ isActiveStep ? "step" : null }>
		<span className="yst-flex yst-items-center" aria-hidden={ isActiveStep ? "true" : null }>
			<StepCircle
				isActive={ isActiveStep }
				isFinished={ isFinished }
				isLastStep={ isLastStep }
				activationDelay={ stepperTimings.delayBeforeOpening }
				deactivationDelay={ 0 }
			/>
		</span>
		{ /* Name and description. */ }
		<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col">
			<span className={ "yst-text-xs yst-font-[650] yst-tracking-wide yst-uppercase " + nameClassNames }>
				{ name }
			</span>
			{ description && <span className="yst-text-sm yst-text-gray-500">{ description }</span> }
		</span>
		{ ( ! isLastStep ) &&
			<button
				className={ `yst-button--secondary yst-button--small yst-ml-auto yst-mr-1 yst-transition-opacity yst-duration-1000 yst-relative yst-ease-out ${
					( showEditButton && ! isStepBeingEdited )
						? `${stepperTimingClasses.fadeDuration} yst-opacity-100`
						: `${stepperTimingClasses.delayBeforeOpening} yst-opacity-0` }` }
				onClick={ editStep }
			>
				Edit
			</button> }
	</div>;
}

StepHeader.propTypes = {
	name: PropTypes.string.isRequired,
	isActiveStep: PropTypes.bool.isRequired,
	isFinished: PropTypes.bool.isRequired,
	isLastStep: PropTypes.bool.isRequired,
	isStepBeingEdited: PropTypes.bool.isRequired,
	description: PropTypes.string,
	showEditButton: PropTypes.bool,
	editStep: PropTypes.func,
};

StepHeader.defaultProps = {
	description: "",
	showEditButton: false,
	editStep: null,
};

/* eslint-enable complexity, max-len */
