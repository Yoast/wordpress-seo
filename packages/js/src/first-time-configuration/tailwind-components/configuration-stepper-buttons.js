import { __ } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { Step } from "./stepper";
import { stepperTimingClasses } from "../stepper-helper";
import classNames from "classnames";
import { HIIVE_STEPS_NAMES } from "../constants";

/**
 * A ContinueButton that always goes to the next step.
 *
 * @param {Object}   props    The props.
 * @param {NodeList} children The Component children.
 *
 * @returns {WPElement} The ContinueButton, that always goes to the next step.
 */
export function ContinueButton( { stepId, beforeGo, children, additionalClasses, ...restProps } ) {
	return ( <Step.GoButton
		id={ `button-${ stepId }-continue` }
		variant="primary"
		className={ additionalClasses }
		destination={ 1 }
		beforeGo={ beforeGo }
		data-hiive-event-name={ `clicked_continue | ${ HIIVE_STEPS_NAMES[ stepId ] }` }
		{ ...restProps }
	>
		{ children }
	</Step.GoButton> );
}

ContinueButton.propTypes = {
	stepId: PropTypes.string.isRequired,
	additionalClasses: PropTypes.string,
	beforeGo: PropTypes.func,
	children: PropTypes.node,
};

ContinueButton.defaultProps = {
	additionalClasses: "",
	beforeGo: null,
	children: null,
};

/**
 * A EditButton that opens the current step.
 *
 * @param {Object}   props    The props.
 * @param {NodeList} children The Component children.
 *
 * @returns {WPElement} The EditButton, that always goes to the step it is placed in.
 */
export function EditButton( { stepId, beforeGo, isVisible, children, additionalClasses, ...restProps } ) {
	const transitionClasses = `yst-transition-opacity ${stepperTimingClasses.slideDuration} yst-ease-out ${ isVisible
		? "yst-opacity-100"
		: `${stepperTimingClasses.delayBeforeOpening} yst-opacity-0 yst-pointer-events-none yst-hidden` }`;


	return ( <Step.GoButton
		id={ `button-${ stepId }-edit` }
		variant="secondary"
		size="small"
		className={ classNames( transitionClasses, additionalClasses ) }
		destination={ 0 }
		beforeGo={ beforeGo }
		data-hiive-event-name={ `clicked_edit | ${ HIIVE_STEPS_NAMES[ stepId ] }` }
		{ ...restProps }
	>
		{ children }
	</Step.GoButton> );
}

EditButton.propTypes = {
	stepId: PropTypes.string.isRequired,
	additionalClasses: PropTypes.string,
	isVisible: PropTypes.bool,
	beforeGo: PropTypes.func,
	children: PropTypes.node,
};

EditButton.defaultProps = {
	additionalClasses: "",
	isVisible: true,
	beforeGo: null,
	children: null,
};

/**
 * A BackButton that always goes to the previous step.
 *
 * @param {Object}   props    The props.
 * @param {NodeList} children The Component children.
 *
 * @returns {WPElement} The BackButton, that always goes to the previous step.
 */
export function BackButton( { stepId, beforeGo, children, additionalClasses, ...restProps } ) {
	return ( <Step.GoButton
		id={ `button-${ stepId }-back` }
		variant="secondary"
		className={ additionalClasses }
		destination={ -1 }
		beforeGo={ beforeGo }
		data-hiive-event-name={ `clicked_go_back | ${ HIIVE_STEPS_NAMES[ stepId ] }` }
		{ ...restProps }
	>
		{ children }
	</Step.GoButton> );
}

BackButton.propTypes = {
	stepId: PropTypes.string.isRequired,
	additionalClasses: PropTypes.string,
	beforeGo: PropTypes.func,
	children: PropTypes.node,
};

BackButton.defaultProps = {
	additionalClasses: "",
	beforeGo: null,
	children: null,
};

/**
 * A convenience class for the most common configuration of Stepper buttons: continue and back.
 *
 * @param {Object}   props                The props for the StepButtons.
 * @param {string}   props.stepId         The step id.
 * @param {function} props.beforeContinue A function to call before continueing. Should return true when ready to continue.
 * @param {function} props.beforeBack     A function to call before going back. Should return true when ready to go back.
 * @param {string}   props.continueLabel  A label to display on the Continue Button.
 * @param {string}   props.backLabel      A label to display on the Back Button.
 *
 * @returns {WPElement} The most common stepper buttons: continue and back.
 */
export function StepButtons( { stepId, beforeContinue, continueLabel, beforeBack, backLabel } ) {
	return <div className="yst-mt-12">
		<ContinueButton
			stepId={ stepId }
			beforeGo={ beforeContinue }
		>
			{ continueLabel }
		</ContinueButton>
		<BackButton
			stepId={ stepId }
			additionalClasses="yst-ms-3"
			beforeGo={ beforeBack }
		>
			{ backLabel }
		</BackButton>
	</div>;
}

StepButtons.propTypes = {
	stepId: PropTypes.string.isRequired,
	beforeContinue: PropTypes.func,
	continueLabel: PropTypes.string,
	beforeBack: PropTypes.func,
	backLabel: PropTypes.string,
};

StepButtons.defaultProps = {
	beforeContinue: null,
	continueLabel: __( "Continue", "wordpress-seo" ),
	beforeBack: null,
	backLabel: __( "Go back", "wordpress-seo" ),
};

/**
 * A convenience class for the Configuration stepper buttons:
 * "Save and continue" and "Go back" when the stepper is in progress, "Save changes" when the Stepper has been completed once.
 *
 * @param {Object}   props                     The props for the StepButtons.
 * @param {string}   props.stepId              The step id.
 * @param {boolean}  props.stepperFinishedOnce Whether the stepper has been completed once.
 * @param {function} props.saveFunction        A function to call upon clicking the "Save Changes" button.
 * @param {string}   props.setEditState        A function to set the edit state of the Stepper.
 *
 * @returns {WPElement} The most common stepper buttons: continue and back.
 */
export function ConfigurationStepButtons( { stepId, stepperFinishedOnce, saveFunction, setEditState } ) {
	const onSaveClick = useCallback( async() => {
		const saveSuccesful = await saveFunction();

		// If save is not successful: we are still editing
		setEditState( ! saveSuccesful );
		return saveSuccesful;
	}, [ saveFunction ] );

	if ( stepperFinishedOnce ) {
		return <Step.GoButton
			id={ `button-${ stepId }-go` }
			variant="primary"
			className="yst-mt-12"
			destination="last"
			beforeGo={ onSaveClick }
			data-hiive-event-name={ `clicked_save_changes | ${ HIIVE_STEPS_NAMES[ stepId ] }` }
		>
			{ __( "Save changes", "wordpress-seo" ) }
		</Step.GoButton>;
	}

	return <StepButtons stepId={ stepId } beforeContinue={ saveFunction } continueLabel={ __( "Save and continue", "wordpress-seo" ) } />;
}

ConfigurationStepButtons.propTypes = {
	stepId: PropTypes.string.isRequired,
	stepperFinishedOnce: PropTypes.bool.isRequired,
	saveFunction: PropTypes.func.isRequired,
	setEditState: PropTypes.func.isRequired,
};
