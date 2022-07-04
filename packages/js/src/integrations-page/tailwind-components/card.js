import apiFetch from "@wordpress/api-fetch";
import { useState, useCallback } from "@wordpress/element";
import { PropTypes } from "prop-types";
import { ToggleField, Badge, Alert } from "@yoast/ui-library";
import { makeOutboundLink } from "@yoast/helpers";

/* eslint-disable complexity */
/**
 * Modal component.
 *
 * @param {Object}   props                       The props.
 * @param {Object}   props.integration           Contents of the modal.
 * @param {JSX.node} props.children              Contents of the modal.
 *
 * @returns {JSX.Element} The modal element.
 */
export default function Card( { integration, children } ) {
	const basePath = "yoast/v1/integrations";
	const isPremiumInstalled = Boolean( window.wpseoScriptData.isPremium );
	const isIntegrationAvailable = ( integration.isPremium && isPremiumInstalled ) || ! integration.isPremium;
	const [ isActive, setIsActive ] = useState( integration.isActive );
	const [ errorMessage, setErrorMessage ] = useState( "" );
	const UpsellButton = makeOutboundLink();
	const upsellLink = "https://yoa.st/workout-orphaned-content-upsell";

	/**
	 * Updates an integration state.
	 *
	 * @param {string} integrationName The integration name.
	 * @param {bool} setActive If the integration must be activated.
	*
	 * @returns {Promise|bool} A promise, or false if the call fails.
	 */
	async function updateIntegrationState( integrationName, setActive ) {
		const response = await apiFetch( {
			path: `${basePath}/set_${integrationName}_active`,
			method: "POST",
			data: { active: setActive },
		} );
		return await response.json;
	}

	const toggleActive = useCallback(
		() => {
			setIsActive( ! isActive );
			updateIntegrationState( integration.name, ! isActive ).then( () => {
				setErrorMessage( "" );
				return true;
			} )
				.catch( ( e ) => {
					if ( e.message ) {
						setErrorMessage( e.message );
					}
					return false;
				} );
		},
		[ isActive, setIsActive ]
	);
	return (
		<div className={ `yst-relative yst-flex yst-flex-col yst-bg-white yst-rounded-lg yst-border yst-p-6 yst-space-y-6 yst-overflow-hidden yst-transition-transform yst-ease-in-out yst-duration-200 ${ isIntegrationAvailable ? "yst-border-gray-200 yst-shadow-sm" : "yst-border-gray-200 yst-shadow-sm" }` }>
			{ /* Header */ }
			<div className={ `yst-relative yst-flex yst-items-center yst-justify-center yst-h-24 yst-bg-gray-100 yst--mx-6 yst--mt-6 yst-py-6 ${ isActive ? "" : "yst-opacity-50 yst-filter yst-grayscale" }` }>
				{ integration.logo }
			</div>
			{ /* Body */ }
			<div className={ `yst-flex-grow ${ isActive ? "" : "yst-opacity-50  yst-filter yst-grayscale" } ` }>
				<h4 className="yst-flex yst-items-center yst-text-base yst-mb-3">
					<span>{ integration.name }</span>
				</h4>
				{ integration.description && <p> { integration.description } </p> }
				{ integration.usps && <ul className="yst-space-y-3">
					{ integration.usps.map( ( usp, index ) => {
						return (
							<li key={ index } className="yst-flex yst-items-start">
								<svg xmlns="http://www.w3.org/2000/svg" className="yst-h-5 yst-w-5 yst-mr-2 yst-text-green-400 yst-flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
								</svg>
								<span> { usp } </span>
							</li>
						);
					} ) }
				</ul> }
			</div>

			{ /* Footer */ }
			<div className="yst-border-t yst-border-gray-200 yst-pt-6">
				{ isIntegrationAvailable
					? <ToggleField checked={ isActive } label={ `Enable ${ integration.name }` } onChange={ toggleActive } />
					: <UpsellButton id={`${integration.name}-upsell-button` } href={ upsellLink } className="yoast-button yoast-button-upsell yst-max-h-1">
						<svg xmlns="http://www.w3.org/2000/svg" className="yst--ml-1 yst-mr-2 yst-h-5 yst-w-5 yst-text-yellow-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
							<path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
						</svg>
						Unlock with Premium
						<span aria-hidden="true" className="yoast-button-upsell__caret" />
					</UpsellButton>
				}
				{ errorMessage && <Alert variant="error" className="yst-mt-2">{ errorMessage }</Alert> }
			</div>

		</div>
	);
}

Card.propTypes = {
	integration: PropTypes.object.isRequired,
	children: PropTypes.node,
};
