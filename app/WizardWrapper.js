import React from "react";

import Wizard from "../composites/OnboardingWizard/OnboardingWizard";
import Config from "../composites/OnboardingWizard/config/production-config";
import apiConfig from "../composites/OnboardingWizard/config/api-config";

function cloneDeep( object ) {
	return JSON.parse( JSON.stringify( object ) );
}

const WizardWrapper = () => {
	let config = cloneDeep( Config );

	// @todo: Add customComponents manually, because cloneDeep is clearing the value of it. Should be solved.
	config.customComponents = Config.customComponents;
	config.endpoint = apiConfig;

	return <Wizard { ...config } />;
};

export default WizardWrapper;
