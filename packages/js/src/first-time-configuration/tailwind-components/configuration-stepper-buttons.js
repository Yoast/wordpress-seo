import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import { HIIVE_STEPS_NAMES } from "../constants";
import { stepperTimingClasses } from "../stepper-helper";
import { Step } from "./stepper";

/**
 * A ContinueButton that always goes to the next step.
 *
 * @param {Object} props Component props. Additional props are passed to the GoButton.
 * @param {string} props.stepId The ID of the step this button is associated with.
 * @param {string} [props.additionalClasses=""] Additional classes to apply to the button.
 * @param {?Function} [props.beforeGo=null] A function to call before going to the next step.
 * @param {React.ReactNode} [props.children=null] The content of the button.
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

/**
 * A EditButton that opens the current step.
 *
 * @param {Object} props Component props. Additional props are passed to the GoButton.
 * @param {string} props.stepId The ID of the step this button is associated with.
 * @param {string} [props.additionalClasses=""] Additional classes to apply to the button.
 * @param {boolean} [props.isVisible=true] Whether the button is visible or not.
 * @param {?Function} [props.beforeGo=null] A function to call before going to the step.
 * @param {React.ReactNode} [props.children=null] The content of the button.
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

/**
 * A BackButton that always goes to the previous step.
 *
 * @param {Object} props Component props. Additional props are passed to the GoButton.
 * @param {string} props.stepId The ID of the step this button is associated with.
 * @param {string} [props.additionalClasses=""] Additional classes to apply to the button.
 * @param {?Function} [props.beforeGo=null] A function to call before going to the previous step.
 * @param {React.ReactNode} [props.children=null] The content of the button.
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

/**
 * A convenience class for the most common configuration of Stepper buttons: continue and back.
 *
 * @param {Object} props Component props.
 * @param {string} props.stepId The ID of the step this button is associated with.
 * @param {?Function} [props.beforeContinue=null] A function to call before going to the next step.
 * @param {string} [props.continueLabel] The label for the continue button.
 * @param {?Function} [props.beforeBack=null] A function to call before going to the previous step.
 * @param {string} [props.backLabel] The label for the back button.
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

/**
 * A convenience class for the Configuration stepper buttons:
 * "Save and continue" and "Go back" when the stepper is in progress, "Save changes" when the Stepper has been completed once.
 *
 * @param {Object} props Component props.
 * @param {string} props.stepId The ID of the step this button is associated with.
 * @param {boolean} props.stepperFinishedOnce Whether the stepper has been completed at least once.
 * @param {Function} props.saveFunction The function to call when saving the step.
 * @param {Function} props.setEditState The function to set the edit state of the step.
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
