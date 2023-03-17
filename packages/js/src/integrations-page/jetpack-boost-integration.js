import { ArrowSmRightIcon, CheckIcon, XIcon } from "@heroicons/react/solid";
import { ExclamationIcon } from "@heroicons/react/outline";
import { __, sprintf } from "@wordpress/i18n";
import { Link } from "@yoast/ui-library";
import { PropTypes } from "prop-types";
import { Card } from "./tailwind-components/card";

/* eslint-disable complexity */
/**
 * An integration for Jetpack Boost.
 *
 * @param {object} integration           The integration data object.
 * @param {bool}   isJetpackBoostActive  True if the Jetpack Boost is active.
 * @param {bool}   isJetpackBoostPremium True if the Jetpack Boost is premium.
 *
 * @returns {WPElement} A card representing an integration for Jetpack Boost.
 */
export const JetpackBoostIntegration = ( {
	integration,
	isJetpackBoostActive,
	isJetpackBoostPremium,
} ) => {
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
						className={ `${ isJetpackBoostActive
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
						<span>{ integration.claim }</span>
					</h4>
					<p> { integration.description }
						{ integration.learnMoreLink && <Link
							href={ integration.learnMoreLink }
							className="yst-flex yst-items-center yst-mt-3 yst-no-underline yst-font-medium"
							target="_blank"
						>
							{ integration.learnMoreLinkText }
							<span className="yst-sr-only">
								{ __( "(Opens in a new browser tab)", "wordpress-seo" ) }
							</span>
							<ArrowSmRightIcon className="yst-h-4 yst-w-4 yst-ml-1 yst-icon-rtl" />
						</Link> }
					</p>
				</div>
			</Card.Content>
			<Card.Footer>
				{ ! isJetpackBoostActive && <p className="yst-flex yst-items-start yst-justify-between">
					<span className="yst-text-slate-700 yst-font-medium">
						{ __( "Plugin not detected", "wordpress-seo" ) }
					</span>
					<XIcon className="yst-h-5 yst-w-5 yst-text-red-500 yst-flex-shrink-0" />
				</p> }
				{ isJetpackBoostActive && ! isJetpackBoostPremium && <p className="yst-flex yst-items-start yst-justify-between">
					<span className="yst-text-slate-700 yst-font-medium">
						{ __( "Integration active, upgrade available", "wordpress-seo" ) }
					</span>
					<ExclamationIcon className="yst-h-5 yst-w-5 yst-text-orange-400 yst-flex-shrink-0" />
				</p> }
				{ isJetpackBoostActive && isJetpackBoostPremium && <p className="yst-flex yst-items-start yst-justify-between">
					<span className="yst-text-slate-700 yst-font-medium">
						{ __( "Integration active", "wordpress-seo" ) }
					</span>
					<CheckIcon
						className="yst-h-5 yst-w-5 yst-text-green-400 yst-flex-shrink-0"
					/>
				</p> }
			</Card.Footer>
		</Card>
	);
};

JetpackBoostIntegration.propTypes = {
	integration: PropTypes.shape( {
		name: PropTypes.string,
		claim: PropTypes.string,
		learnMoreLinkText: PropTypes.string,
		learnMoreLink: PropTypes.string,
		logoLink: PropTypes.string,
		slug: PropTypes.string,
		description: PropTypes.string,
		logo: PropTypes.func,
	} ),
	isJetpackBoostActive: PropTypes.bool,
	isJetpackBoostPremium: PropTypes.bool,
};
