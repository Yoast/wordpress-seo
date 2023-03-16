import { ArrowSmRightIcon, XIcon } from "@heroicons/react/solid";
import { __, sprintf } from "@wordpress/i18n";
import { Link } from "@yoast/ui-library";
import { PropTypes } from "prop-types";
import { getIsCardActive } from "./helper";
import { Card } from "./tailwind-components/card";

/* eslint-disable complexity */
/**
 * An integration for Jetpack Boost.
 *
 * @param {object}    integration             The integration.
 * @param {bool}      initialActivationState  True if the integration has been activated by the user.
 * @param {boolean}   isPrerequisiteActive    Whether the plugin to which we want to integrate is active.
 * @param {boolean}   isActive                Whether the integration state is active.
 *
 *
 * @returns {WPElement} A card representing an integration which can be toggled active by the user.
 */
export const JetpackBoostIntegration = ( {
	integration,
	isPrerequisiteActive,
	isActive,
	isIntegrationPremium,
} ) => {
	const IntegrationLogo = integration.logo;
	// If integration is not active, and we have a different url for inactive state, use that url.
	let learnMoreUrl = integration.learnMoreLink;
	if ( ! isActive && integration.linkInActive ) {
		learnMoreUrl = integration.linkInActive;
	}
	if ( ! isIntegrationPremium && integration.linkUpgrade ) {
		learnMoreUrl = integration.linkUpgrade;
	}
	// If integration is not active, and we have a different text for inactive state, use that text.
	const learnMoreLinkText = ! isActive && integration.linkTextInActive ? integration.linkTextInActive : __( "Learn more", "wordpress-seo" );

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
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Link>
			</Card.Header>
			<Card.Content>
				<div>
					<h4 className="yst-flex yst-items-center yst-text-base yst-mb-3 yst-font-medium yst-text-[#111827] yst-leading-tight">
						<span>{ integration.claim && integration.claim }</span>
					</h4>
					<p> { integration.description }
						{ learnMoreUrl && <Link
							href={ learnMoreUrl }
							className="yst-flex yst-items-center yst-mt-3 yst-no-underline yst-font-medium"
							target="_blank"
						>
							{ learnMoreLinkText }
							<span className="yst-sr-only">
								{ __( "(Opens in a new browser tab)", "wordpress-seo" ) }
							</span>
							<ArrowSmRightIcon className="yst-h-4 yst-w-4 yst-ml-1 yst-icon-rtl" />
						</Link> }
					</p>
				</div>
			</Card.Content>
			<Card.Footer>
				{ ! isPrerequisiteActive && <p className="yst-flex yst-items-start yst-justify-between">
					<span className="yst-text-slate-700 yst-font-medium">
						{ __( "Plugin not detected", "wordpress-seo" ) }
					</span>
					<XIcon className="yst-h-5 yst-w-5 yst-text-red-500 yst-flex-shrink-0" />
				</p> }
			</Card.Footer>
		</Card>
	);
};

JetpackBoostIntegration.propTypes = {
	integration: PropTypes.shape( {
		name: PropTypes.string,
		claim: PropTypes.string,
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
	isPrerequisiteActive: PropTypes.bool,
	isActive: PropTypes.bool,
	isIntegrationPremium: PropTypes.bool,
};
