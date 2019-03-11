import React from "react";

import Wizard from "../composites/OnboardingWizard/OnboardingWizard";
import Config from "../composites/OnboardingWizard/config/production-config";
import apiConfig from "../composites/OnboardingWizard/config/api-config";

/**
 * Returns a deep clone of an object.
 *
 * @param {object} object The object to clone.
 *
 * @returns {object} The cloned object.
 */
function cloneDeep( object ) {
	return JSON.parse( JSON.stringify( object ) );
}

/**
 * The wizard component.
 *
 * @returns {React.component} A wizard.
 */
const WizardWrapper = () => {
	const config = cloneDeep( Config );

	config.customComponents = Config.customComponents;
	config.endpoint = apiConfig;

	return <Wizard { ...config } />;
};

export default WizardWrapper;
