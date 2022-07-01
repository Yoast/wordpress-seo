import apiFetch from "@wordpress/api-fetch";
import { useState, useCallback } from "@wordpress/element";
import { PropTypes } from "prop-types";
import { ToggleField, Badge } from "@yoast/ui-library";

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
	const isPremiumInstalled = Boolean( "window.wpseoScriptData.isPremium" );
	const isIntegrationAvailabe = ( integration.isPremium && isPremiumInstalled ) || ! integration.isPremium;
	const [ isActive, setIsActive ] = useState( integration.isActive );

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
				console.log( "OK!" );
				return true;
			} )
				.catch( ( e ) => {
					if ( e.message ) {
						Error.log( e.message );
					}
					return false;
				} );
		},
		[ isActive, setIsActive ]
	);

	return (
		<div key={ integration.title } className="yst-flex yst-flex-col yst-border-2 yst-border-gray-200 yst-w-[350px] yst-rounded-lg yst-shadow-lg yst-overflow-hidden yst-mr-3 yst-mb-4">
			<div className="yst-flex-1 yst-bg-gray-100 yst-p-6 yst-flex yst-justify-center yst-content-center">
				{ integration.logo }
			</div>
			<div className="yst-flex-1 yst-bg-white yst-p-6 yst-flex yst-flex-col yst-justify-between">
				<div className="yst-flex-1 yst-pb-6">
					<p className="yst-text-base yst-font-semibold yst-text-gray-900">
						{integration.name}
						<Badge variant="upsell">
							Premium
						</Badge>
					</p>
					<p className="yst-mt-3 yst-text-base yst-text-gray-500">{ integration.description }</p>
				</div>
				<div className="yst-flex-1 yst-border-t-2 yst-pt-6">
					<ToggleField
						checked={ isActive }
						label={ `Enable ${ integration.name }` }
						onChange={ toggleActive }
						disabled={ ! isIntegrationAvailabe }
					/>
				</div>
			</div>
		</div>
	);
}

Card.propTypes = {
	integration: PropTypes.object.isRequired,
	children: PropTypes.node,
};
