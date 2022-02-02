import { StepCircle } from "./StepCircle";
import PropTypes from "prop-types";
import { stepperTimings } from "../stepper-helper";

/**
 * Gets the classnames for the step name.
 *
 * @param {boolean} isSaved      Whether the step is saved.
 * @param {boolean} isActiveStep Whether the step is active.
 * @param {boolean} isLastStep   Whether it is the last step.
 *
 * @returns {string} The classnames for the step name.
 */
function getNameClassnames( isSaved, isActiveStep, isLastStep ) {
	if ( isActiveStep && ! isLastStep ) {
		return "yst-text-primary-500";
	}
	return isSaved ? "" : "yst-text-gray-500";
}

/**
 * The Step header component.
 *
 * @param {Object}   props                 The props object.
 * @param {number}   props.stepIndex       The index of the current step.
 * @param {function} props.saveAndContinue A function to call when the primary button is clicked.
 * @param {function} props.goBack          A function to call when the "Go Back" button is clicked.
 *
 * @returns {WPElement} The StepButtons component.
 */
export default function StepHeader( { step, isActiveStep, isSaved, isLastStep, showEditButton, editStep } ) {
	const nameClassNames = getNameClassnames( isSaved, isActiveStep, isLastStep );

	return <div className="yst-relative yst-flex yst-items-start yst-group" aria-current={ isActiveStep ? "step" : null }>
		<span className="yst-flex yst-items-center" aria-hidden={ isActiveStep ? "true" : null }>
			<StepCircle
				isActive={ isActiveStep }
				isSaved={ isSaved }
				isLastStep={ isLastStep }
				activationDelay={ stepperTimings.delayBeforeOpening }
				deactivationDelay={ 0 }
			/>
		</span>
		{ /* Name and description. */ }
		<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col yst-self-center">
			<span className={ "yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase " + nameClassNames }>
				{ step.name }
			</span>
			{ step.description && <span className="yst-text-sm yst-text-gray-500">{ step.description }</span> }
		</span>
		{ ( showEditButton && ! isLastStep ) &&
			<button
				className="yst-button--secondary yst-button--small yst-ml-auto"
				onClick={ editStep }
			>
				Edit
			</button> }
	</div>;
}

const stepShape = PropTypes.shape( {
	name: PropTypes.string.isRequired,
	description: PropTypes.string,
	component: PropTypes.element.isRequired,
	isSaved: PropTypes.bool.isRequired,
} );

StepHeader.propTypes = {
	step: stepShape.isRequired,
	isLastStep: PropTypes.bool.isRequired,
	showEditButton: PropTypes.bool,
	editStep: PropTypes.func,
	isActiveStep: PropTypes.bool.isRequired,
	isSaved: PropTypes.bool.isRequired,
};

StepHeader.defaultProps = {
	editStep: null,
	showEditButton: false,
};
