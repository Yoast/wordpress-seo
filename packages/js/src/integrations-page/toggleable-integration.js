import { useCallback, useState } from "@wordpress/element";
import { Card } from "./tailwind-components/card";
import { getIsCardActive, getIsFreeIntegrationOrPremiumAvailable, getIsMultisiteAvailable } from "./helper";
import { Badge, Button, Link, ToggleField } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import { ArrowSmRightIcon, XIcon } from "@heroicons/react/solid";
import { LockOpenIcon } from "@heroicons/react/outline";
import { PropTypes } from "prop-types";
import { Slot } from "@wordpress/components";

/* eslint-disable complexity */
/**
 * An integration which can be toggled on and off.
 *
 * @param {object}    integration             The integration.
 * @param {bool}      initialActivationState  True if the integration has been activated by the user.
 * @param {bool}      isNetworkControlEnabled True if the integration is network-enabled.
 * @param {bool}      isMultisiteAvailable    True if the integration is available on multisites.
 * @param {string}    toggleLabel             The toggle label.
 * @param {function}  beforeToggle            Check function to call before toggling the integration.
 *
 * @returns {WPElement} A card representing an integration which can be toggled active by the user.
 */
export const ToggleableIntegration = ( {
	integration,
	initialActivationState,
	isNetworkControlEnabled,
	isMultisiteAvailable,
	toggleLabel,
	beforeToggle } ) => {
	const [ isActive, setIsActive ] = useState( initialActivationState );

	/**
	 * The toggle management.
	 *
	 * @returns {Boolean} The footer.
	 */
	const toggleActive = useCallback(
		async() => {
			let canToggle = true;
			const newState = ! isActive;
			// Immediately switch the toggle for enhanced UX
			setIsActive( newState );

			if ( beforeToggle ) {
				canToggle = false;
				canToggle = await beforeToggle( integration, newState );
			}
			if ( ! canToggle ) {
				// If something went wrong, switch the toggle back
				setIsActive( ! newState );
			}
		}, [ isActive, beforeToggle, setIsActive ] );

	const IntegrationLogo = integration.logo;

	return (
		<Card>
			<Card.Header>
				{ integration.logo && <IntegrationLogo alt={ `${ integration.name } logo` } className={ `${ getIsCardActive( integration, isActive ) ? "" : "yst-opacity-50 yst-filter yst-grayscale" }` } /> }
				{ ( ! isNetworkControlEnabled && isMultisiteAvailable ) && <Badge className="yst-absolute yst-top-2 yst-right-2">{ __( "Network Disabled", "wordpress-seo" ) }</Badge> }
				{ ( isNetworkControlEnabled && integration.isNew ) && <Badge className="yst-absolute yst-top-2 yst-right-2">{ __( "New", "wordpress-seo" ) }</Badge> }
			</Card.Header>
			<Card.Content>
				<div className={ `${ ( getIsCardActive( integration, isActive ) ) ? "" : "yst-opacity-50  yst-filter yst-grayscale" }` }>
					<h4 className="yst-flex yst-items-center yst-text-base yst-mb-3 yst-font-medium yst-text-[#111827] yst-leading-tight">
						<span>{ integration.claim && integration.claim }</span>
					</h4>
					<p> { integration.description }
						{ integration.learnMoreLink && <Link
							href={ integration.learnMoreLink }
							className={ classNames( "yst-flex yst-items-center yst-mt-3 yst-no-underline yst-font-medium", ( getIsCardActive( integration, isActive ) ) ? "" : "yst-pointer-events-none" ) }
							target="_blank"
						>
							Learn more
							<span className="yst-sr-only">
								{
									__( "(Opens in a new browser tab)", "wordpress-seo" )
								}
							</span>
							<ArrowSmRightIcon className="yst-h-4 yst-w-4 yst-ml-1" />
						</Link> }
					</p>
				</div>
				{ isActive &&
					<Slot
						name={ `${integration.name}Slot` }
					/> }
			</Card.Content>
			<Card.Footer>
				{ ! getIsFreeIntegrationOrPremiumAvailable( integration ) && <Button
					id={ `${ integration.name }-upsell-button` }
					type="button"
					as="a"
					href={ integration.upsellLink }
					variant="upsell"
					className="yst-w-full yst-text-gray-800"
					target="_blank"
				>
					<LockOpenIcon
						className="yst--ml-1 yst-mr-2 yst-h-5 yst-w-5 yst-text-yellow-900"
					/>
					{ __( "Unlock with Premium", "wordpress-seo" ) }
					<span className="yst-sr-only">
						{
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Button>
				}
				{ getIsFreeIntegrationOrPremiumAvailable( integration ) && ! getIsMultisiteAvailable( integration ) && <p className="yst-flex yst-items-start yst-justify-between">
					<span className="yst-text-gray-700 yst-font-medium">{ __( "Integration unavailable for multisites", "wordpress-seo" ) }</span>
					<XIcon
						className="yst-h-5 yst-w-5 yst-text-red-500 yst-flex-shrink-0"
					/>
				</p>  }
				{ getIsFreeIntegrationOrPremiumAvailable( integration ) && getIsMultisiteAvailable( integration ) && <ToggleField
					checked={ isActive }
					label={ toggleLabel }
					onChange={ toggleActive }
					disabled={ ! isNetworkControlEnabled || ! isMultisiteAvailable }
				/> }
			</Card.Footer>
		</Card>
	);
};

ToggleableIntegration.propTypes = {
	integration: PropTypes.shape( {
		name: PropTypes.string,
		claim: PropTypes.string,
		learnMoreLink: PropTypes.string,
		type: PropTypes.string,
		slug: PropTypes.string,
		description: PropTypes.string,
		usps: PropTypes.array,
		logo: PropTypes.func,
		isPremium: PropTypes.bool,
		isNew: PropTypes.bool,
		isMultisiteAvailable: PropTypes.bool,
		upsellLink: PropTypes.string,
	} ),
	initialActivationState: PropTypes.bool,
	isNetworkControlEnabled: PropTypes.bool,
	isMultisiteAvailable: PropTypes.bool,
	toggleLabel: PropTypes.string,
	beforeToggle: PropTypes.func,
};
