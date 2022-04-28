import { __ } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { Step } from "./Stepper";
import { stepperTimingClasses } from "../stepper-helper";
import classNames from "classnames";

/**
 * A ContinueButton that always goes to the next step.
 *
 * @param {Object}   props    The props.
 * @param {NodeList} children The Component children.
 *
 * @returns {WPElement} The ContinueButton, that always goes to the next step.
 */
export function ContinueButton( { beforeGo, children, additionalClasses, ...restProps } ) {
	return ( <Step.GoButton
		className={ `yst-button yst-button--primary ${ additionalClasses }` }
		destination={ 1 }
		beforeGo={ beforeGo }
		{ ...restProps }
	>
		{ children }
	</Step.GoButton> );
}

ContinueButton.propTypes = {
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
export function EditButton( { beforeGo, isVisible, children, additionalClasses, ...restProps } ) {
	const transitionClasses = `yst-transition-opacity ${stepperTimingClasses.slideDuration} yst-ease-out ${ isVisible
		? "yst-opacity-100"
		: `${stepperTimingClasses.delayBeforeOpening} yst-opacity-0 yst-pointer-events-none yst-hidden` }`;


	return ( <Step.GoButton
		className={ classNames(
			"yst-button yst-button--secondary yst-button--small",
			transitionClasses,
			additionalClasses
		) }
		destination={ 0 }
		beforeGo={ beforeGo }
		{ ...restProps }
	>
		{ children }
	</Step.GoButton> );
}

EditButton.propTypes = {
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
export function BackButton( { beforeGo, children, additionalClasses, ...restProps } ) {
	return ( <Step.GoButton
		className={ `yst-button yst-button--secondary ${ additionalClasses }` }
		destination={ -1 }
		beforeGo={ beforeGo }
		{ ...restProps }
	>
		{ children }
	</Step.GoButton> );
}

BackButton.propTypes = {
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
 * @param {function} props.beforeContinue A function to call before continueing. Should return true when ready to continue.
 * @param {function} props.beforeBack     A function to call before going back. Should return true when ready to go back.
 * @param {string}   props.continueLabel  A label to display on the Continue Button.
 * @param {string}   props.backLabel      A label to display on the Back Button.
 *
 * @returns {WPElement} The most common stepper buttons: continue and back.
 */
export function StepButtons( { beforeContinue, continueLabel, beforeBack, backLabel } ) {
	return <div className="yst-mt-12">
		<ContinueButton beforeGo={ beforeContinue }>{ continueLabel }</ContinueButton>
		<BackButton additionalClasses="yst-ml-3" beforeGo={ beforeBack }>{ backLabel }</BackButton>
	</div>;
}

StepButtons.propTypes = {
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
 * A convenience class for the ConfigurationWorkout buttons:
 * "Save and continue" and "Go back" when the stepper is in progress, "Save changes" when the Stepper has been completed once.
 *
 * @param {Object}   props                     The props for the StepButtons.
 * @param {boolean}  props.stepperFinishedOnce Whether the stepper has been completed once.
 * @param {function} props.saveFunction        A function to call upon clicking the "Save Changes" button.
 * @param {string}   props.setEditState        A function to set the edit state of the Stepper.
 *
 * @returns {WPElement} The most common stepper buttons: continue and back.
 */
export function ConfigurationStepButtons( { stepperFinishedOnce, saveFunction, setEditState } ) {
	const onSaveClick = useCallback( () => {
		const saveSuccesful = saveFunction();

		// If save is not succesful: we are still editing
		setEditState( ! saveSuccesful );
		return saveSuccesful;
	} );

	if ( stepperFinishedOnce ) {
		return <Step.GoButton className="yst-button yst-button--primary yst-mt-12" destination="last" beforeGo={ onSaveClick }>
			{ __( "Save changes", "wordpress-seo" ) }
		</Step.GoButton>;
	}

	return <StepButtons beforeContinue={ saveFunction } continueLabel={ __( "Save and continue", "wordpress-seo" ) } />;
}

ConfigurationStepButtons.propTypes = {
	stepperFinishedOnce: PropTypes.bool.isRequired,
	saveFunction: PropTypes.func.isRequired,
	setEditState: PropTypes.func.isRequired,
};
