import React from "react";

import Config from "../../packages/configuration-wizard/tools/config/production-config";
import apiConfig from "../../packages/configuration-wizard/tools/config/api-config";
import { default as Wizard } from "@yoast/configuration-wizard";

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
