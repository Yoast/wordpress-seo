import PropTypes from "prop-types";
import { Step } from "./Stepper";
import { __ } from "@wordpress/i18n";

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
		className={ `yst-button--primary ${ additionalClasses }` }
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
 * A ContinueButton that always goes to the next step.
 *
 * @param {Object}   props    The props.
 * @param {NodeList} children The Component children.
 *
 * @returns {WPElement} The ContinueButton, that always goes to the next step.
 */
export function BackButton( { beforeGo, children, additionalClasses, ...restProps } ) {
	return ( <Step.GoButton
		className={ `yst-button--secondary ${ additionalClasses }` }
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
 * @param {Object} props The props for the StepButtons.
 * @param {function} props.beforeContinue A function to call before continueing. Should return true when ready to continue.
 * @param {function} props.beforeBack A function to call before going back. Should return true when ready to go back.
 * @param {string} props.continueLabel A label to display on the Continue Button.
 * @param {string} props.backLabel A label to display on the Back Button.
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
	backLabel: __( "Go Back", "wordpress-seo" ),
};
