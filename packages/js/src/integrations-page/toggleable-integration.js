import { useCallback, useState } from "@wordpress/element";
import { Card } from "./tailwind-components/card";
import { getIsCardActive, getIsFreeIntegrationOrPremiumAvailable, getIsMultisiteAvailable } from "./helper";
import { Badge, Button, Link, ToggleField } from "@yoast/ui-library";
import { __, sprintf } from "@wordpress/i18n";
import { ArrowSmRightIcon, XIcon } from "@heroicons/react/solid";
import { LockOpenIcon } from "@heroicons/react/outline";
import { PropTypes } from "prop-types";
import { Slot } from "@wordpress/components";

/* eslint-disable complexity */
/**
 * An integration which can be toggled on and off.
 *
 * @param {object}   integration             The integration.
 * @param {bool}     initialActivationState  True if the integration has been activated by the user.
 * @param {bool}     isNetworkControlEnabled True if the integration is network-enabled.
 * @param {bool}     isMultisiteAvailable    True if the integration is available on multisites.
 * @param {string}   toggleLabel             The toggle label.
 * @param {function} beforeToggle            Check function to call before toggling the integration.
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
				<Link
					href={ integration.logoLink }
					target="_blank"
				>
					{ integration.logo && <IntegrationLogo
						alt={
							sprintf(
								/* translators: 1: Yoast SEO, 2: integration name */
								__( "%1$s integrates with %2$s", "wordpress-seo" ),
								"Yoast SEO",
								integration.name
							)
						}
						className={ `${ getIsCardActive( integration, isActive ) ? "" : "yst-opacity-50 yst-filter yst-grayscale" }` }
					/> }
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Link>
				{ ( ! isNetworkControlEnabled && isMultisiteAvailable ) && <Badge className="yst-absolute yst-top-2 yst-end-2">{ __( "Network Disabled", "wordpress-seo" ) }</Badge> }
				{ ( isNetworkControlEnabled && integration.isNew ) && <Badge className="yst-absolute yst-top-2 yst-end-2">{ __( "New", "wordpress-seo" ) }</Badge> }
			</Card.Header>
			<Card.Content>
				<div>
					{ integration.claim && <h4 className="yst-text-base yst-mb-3 yst-font-medium yst-text-[#111827] yst-leading-tight">
						{ integration.claim }
					</h4> }
					<p> { integration.description }
						{ integration.learnMoreLink && <Link
							href={ integration.learnMoreLink }
							className="yst-flex yst-items-center yst-mt-3 yst-no-underline yst-font-medium"
							target="_blank"
						>
							{ __( "Learn more", "wordpress-seo" ) }
							<span className="yst-sr-only">
								{
									/* translators: Hidden accessibility text. */
									__( "(Opens in a new browser tab)", "wordpress-seo" )
								}
							</span>
							<ArrowSmRightIcon className="yst-h-4 yst-w-4 yst-ms-1 yst-icon-rtl" />
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
					data-action="load-nfd-ctb"
					data-ctb-id="f6a84663-465f-4cb5-8ba5-f7a6d72224b2"
					className="yst-w-full yst-text-slate-800"
					target="_blank"
				>
					<LockOpenIcon
						className="yst--ml-s yst-me-2 yst-h-5 yst-w-5 yst-text-yellow-900"
					/>
					{ __( "Unlock with Premium", "wordpress-seo" ) }
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Button>
				}
				{ getIsFreeIntegrationOrPremiumAvailable( integration ) && ! getIsMultisiteAvailable( integration ) && <p className="yst-flex yst-items-start yst-justify-between">
					<span className="yst-text-slate-700 yst-font-medium">{ __( "Integration unavailable for multisites", "wordpress-seo" ) }</span>
					<XIcon
						className="yst-h-5 yst-w-5 yst-text-red-500 yst-flex-shrink-0"
					/>
				</p>  }
				{ getIsFreeIntegrationOrPremiumAvailable( integration ) && getIsMultisiteAvailable( integration ) && <ToggleField
					id={ `${ integration.name }-toggle` }
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
		claim: PropTypes.node,
		learnMoreLink: PropTypes.string,
		logoLink: PropTypes.string,
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
