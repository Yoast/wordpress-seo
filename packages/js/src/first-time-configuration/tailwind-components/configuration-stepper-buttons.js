import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import PropTypes from "prop-types";
import { HIIVE_STEPS_NAMES } from "../constants";
import { stepperTimingClasses } from "../stepper-helper";
import { Step } from "./stepper";

/**
 * A ContinueButton that always goes to the next step.
 *
 * @param {string} stepId The ID of the step this button is associated with.
 * @param {string} [additionalClasses=""] Additional classes to apply to the button.
 * @param {?function} [beforeGo=null] A function to call before going to the next step.
 * @param {React.ReactNode} [children=null] The content of the button.
 * @param {...Object} [restProps] Additional properties to pass to the button.
 *
 * @returns {JSX.Element} The ContinueButton, that always goes to the next step.
 */
export function ContinueButton( {
	stepId,
	additionalClasses = "",
	beforeGo = null,
	children = null,
	...restProps
} ) {
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

/**
 * A EditButton that opens the current step.
 *
 * @param {string} stepId The ID of the step this button is associated with.
 * @param {string} [additionalClasses=""] Additional classes to apply to the button.
 * @param {boolean} [isVisible=true] Whether the button is visible or not.
 * @param {?function} [beforeGo=null] A function to call before going to the step.
 * @param {React.ReactNode} [children=null] The content of the button.
 * @param {...Object} [restProps] Additional properties to pass to the button.
 *
 * @returns {JSX.Element} The EditButton, that always goes to the step it is placed in.
 */
export function EditButton( {
	stepId,
	additionalClasses = "",
	isVisible = true,
	beforeGo = null,
	children = null,
	...restProps
} ) {
	const transitionClasses = `yst-transition-opacity ${ stepperTimingClasses.slideDuration } yst-ease-out ${ isVisible
		? "yst-opacity-100"
		: `${ stepperTimingClasses.delayBeforeOpening } yst-opacity-0 yst-pointer-events-none yst-hidden` }`;

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

/**
 * A BackButton that always goes to the previous step.
 *
 * @param {string} stepId The ID of the step this button is associated with.
 * @param {string} [additionalClasses=""] Additional classes to apply to the button.
 * @param {?function} [beforeGo=null] A function to call before going to the previous step.
 * @param {React.ReactNode} [children=null] The content of the button.
 * @param {...Object} [restProps] Additional properties to pass to the button.
 *
 * @returns {JSX.Element} The BackButton, that always goes to the previous step.
 */
export function BackButton( {
	stepId,
	additionalClasses = "",
	beforeGo = null,
	children = null,
	...restProps
} ) {
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

/**
 * A convenience class for the most common configuration of Stepper buttons: continue and back.
 *
 * @param {string} stepId The ID of the step this button is associated with.
 * @param {?function} [beforeContinue=null] A function to call before going to the next step.
 * @param {string} [continueLabel] The label for the continue button.
 * @param {?function} [beforeBack=null] A function to call before going to the previous step.
 * @param {string} [backLabel] The label for the back button.
 *
 * @returns {JSX.Element} The most common stepper buttons: continue and back.
 */
export function StepButtons( {
	stepId,
	beforeContinue = null,
	continueLabel = __( "Continue", "wordpress-seo" ),
	beforeBack = null,
	backLabel = __( "Go back", "wordpress-seo" ),
} ) {
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

/**
 * A convenience class for the Configuration stepper buttons:
 * "Save and continue" and "Go back" when the stepper is in progress, "Save changes" when the Stepper has been completed once.
 *
 * @param {string} stepId The ID of the step this button is associated with.
 * @param {boolean} stepperFinishedOnce Whether the stepper has been completed at least once.
 * @param {function} saveFunction The function to call when saving the step.
 * @param {function} setEditState The function to set the edit state of the step.
 *
 * @returns {JSX.Element} The most common stepper buttons: continue and back.
 */
export function ConfigurationStepButtons( { stepId, stepperFinishedOnce, saveFunction, setEditState } ) {
	const onSaveClick = useCallback( async() => {
		const saveSuccessful = await saveFunction();

		// If save is not successful: we are still editing
		setEditState( ! saveSuccessful );
		return saveSuccessful;
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
