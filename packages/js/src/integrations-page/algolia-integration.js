/* eslint-disable complexity */
import LockOpenIcon from "@heroicons/react/outline/LockOpenIcon";
import ArrowSmRightIcon from "@heroicons/react/solid/ArrowSmRightIcon";
import XIcon from "@heroicons/react/solid/XIcon";
import { Slot } from "@wordpress/components";
import { useCallback, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Button, Link, ToggleField } from "@yoast/ui-library";
import { getIsCardActive, getIsFreeIntegrationOrPremiumAvailable, getIsMultisiteAvailable } from "./helper";
import { Card } from "./tailwind-components/card";

/**
 * An integration which can be toggled on and off.
 *
 * @param {Object} props Component props.
 * @param {Object} props.integration The integration.
 * @param {string} [props.integration.name] The integration name.
 * @param {import("react").ReactNode} [props.integration.claim] The integration claim, shown as the card heading.
 * @param {string} [props.integration.learnMoreLink] The URL of the "Learn more" link.
 * @param {string} [props.integration.logoLink] The URL the logo links to.
 * @param {string} [props.integration.slug] The integration slug.
 * @param {string} [props.integration.description] The integration description.
 * @param {Array} [props.integration.usps] The unique selling points of the integration.
 * @param {Function} [props.integration.logo] The logo component.
 * @param {boolean} [props.integration.isPremium] Whether the integration requires Yoast SEO Premium.
 * @param {boolean} [props.integration.isNew] Whether to show the "New" badge.
 * @param {boolean} [props.integration.isMultisiteAvailable] Whether the integration is available on multisites.
 * @param {string} [props.integration.upsellLink] The URL of the upsell button.
 * @param {boolean} props.initialActivationState True if the integration has been activated by the user.
 * @param {boolean} props.isNetworkControlEnabled True if the integration is network-enabled.
 * @param {boolean} props.isMultisiteAvailable True if the integration is available on multisites.
 * @param {string} props.toggleLabel The toggle label.
 * @param {Function} props.beforeToggle Check function to call before toggling the integration.
 * @param {boolean} props.isPrerequisiteActive Whether the plugin to which we want to integrate is active.
 *
 * @returns {JSX.Element} A card representing an integration which can be toggled active by the user.
 */
export const AlgoliaIntegration = ( {
	integration,
	initialActivationState,
	isNetworkControlEnabled,
	isMultisiteAvailable,
	toggleLabel,
	beforeToggle,
	isPrerequisiteActive,
} ) => {
	const [ isActive, setIsActive ] = useState( initialActivationState );

	/**
	 * The toggle management.
	 *
	 * @returns {boolean} The footer.
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
						className={ `${ isPrerequisiteActive && getIsCardActive( integration, isActive )
							? ""
							: "yst-opacity-50 yst-filter yst-grayscale" }` }
					/> }
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Link>
				{ ( ! isNetworkControlEnabled && isMultisiteAvailable ) &&
					<Badge className="yst-absolute yst-top-2 yst-end-2">{ __( "Network Disabled", "wordpress-seo" ) }</Badge> }
				{ ( isNetworkControlEnabled && integration.isNew ) &&
					<Badge className="yst-absolute yst-top-2 yst-end-2">{ __( "New", "wordpress-seo" ) }</Badge> }
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
						name={ `${ integration.name }Slot` }
					/> }
			</Card.Content>
			<Card.Footer>
				{ ! isPrerequisiteActive && <p className="yst-flex yst-items-start yst-justify-between">
					<span className="yst-text-slate-700 yst-font-medium">
						{
							__( "Plugin not detected", "wordpress-seo" )
						}
					</span>
					<XIcon
						className="yst-h-5 yst-w-5 yst-text-red-500 yst-flex-shrink-0"
					/>
				</p> }
				{ isPrerequisiteActive && ! getIsFreeIntegrationOrPremiumAvailable( integration ) && <Button
					id={ `${ integration.name }-upsell-button` }
					type="button"
					as="a"
					href={ integration.upsellLink }
					variant="upsell"
					className="yst-w-full yst-text-slate-800"
					target="_blank"
				>
					<LockOpenIcon
						className="yst--ms-1 yst-me-2 yst-h-5 yst-w-5 yst-text-yellow-900"
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
				{ isPrerequisiteActive && getIsFreeIntegrationOrPremiumAvailable( integration ) && ! getIsMultisiteAvailable( integration ) &&
					<p className="yst-flex yst-items-start yst-justify-between">
						<span
							className="yst-text-slate-700 yst-font-medium"
						>{ __( "Integration unavailable for multisites", "wordpress-seo" ) }</span>
						<XIcon
							className="yst-h-5 yst-w-5 yst-text-red-500 yst-flex-shrink-0"
						/>
					</p> }
				{ isPrerequisiteActive &&
					getIsFreeIntegrationOrPremiumAvailable( integration ) &&
					getIsMultisiteAvailable( integration ) &&
					<ToggleField
						checked={ isActive }
						label={ toggleLabel }
						onChange={ toggleActive }
						disabled={ ! isNetworkControlEnabled || ! isMultisiteAvailable }
					/>
				}
			</Card.Footer>
		</Card>
	);
};
