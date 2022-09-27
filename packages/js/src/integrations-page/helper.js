import apiFetch from "@wordpress/api-fetch";

const isPremiumInstalled = Boolean( window.wpseoScriptData.isPremium );

/**
 * Checks if an integration is active.
 *
 * @param {object} integration The integration.
 *
 * @returns {bool} True if the integration is active, false otherwise.
 */
export const getInitialState = ( integration ) => {
	const integrationOption = `${ integration.slug }_integration_active`;
	return Boolean( window.wpseoIntegrationsData[ integrationOption ] );
};

/**
 * Checks if an integration is network-enabled.
 *
 * @param {object} integration The integration.
 *
 * @returns {bool} True if the integration is active, false otherwise.
 */
export const getIsNetworkControlEnabled = ( integration ) => {
	if ( ! window.wpseoIntegrationsData.is_multisite ) {
		return true;
	}

	const integrationOption = `allow_${ integration.slug }_integration`;

	return Boolean( window.wpseoIntegrationsData[ integrationOption ] );
};

/**
 * Checks if an integration is network-enabled.
 *
 * @param {object} integration The integration.
 *
 * @returns {bool} True if the integration is active, false otherwise.
 */
export const getIsMultisiteAvailable = ( integration ) => {
	if ( ! window.wpseoIntegrationsData.is_multisite ) {
		return true;
	}

	return integration.isMultisiteAvailable;
};

/**
 * Checks if an integration available under those two circumstances:
 * 1) is a free integration;
 * 2) is premium and premium is active.
 *
 * @param {object} integration The integration.
 *
 * @returns {bool} True if the integration is available to the user.
 */
export const getIsFreeIntegrationOrPremiumAvailable = ( integration ) => {
	return ( integration.isPremium && isPremiumInstalled ) || ! integration.isPremium;
};

/* eslint-disable complexity */
/**
 * Checks the conditions for which a card is active
 *
 * @param {object} integration The integration
 * @param {bool}   activeState True if the integration is active.
 *
 * @returns {bool} True if the integration is active, false otherwise.
 */
export const getIsCardActive = ( integration, activeState ) => {
	const cardActive =  activeState;
	const networkControlEnabled = getIsNetworkControlEnabled( integration );
	const multisiteAvailable = getIsMultisiteAvailable( integration );
	const premium = getIsFreeIntegrationOrPremiumAvailable( integration );

	if ( premium ) {
		return cardActive && networkControlEnabled && multisiteAvailable;
	}

	return networkControlEnabled && multisiteAvailable;
};
/* eslint-enable complexity */

/**
 * Updates an integration state.
 *
 * @param {string} integration The integration.
 * @param {bool} setActive If the integration must be activated.
 *
 * @returns {Promise|bool} A promise, or false if the call fails.
 */
export const updateIntegrationState = async( integration, setActive ) => {
	const basePath = "yoast/v1/integrations";

	const response = await apiFetch( {
		path: `${basePath}/set_${integration.slug}_active`,
		method: "POST",
		data: { active: setActive },
	} );
	return await response.json;
};
