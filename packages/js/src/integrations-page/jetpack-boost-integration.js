import { ArrowSmRightIcon, CheckIcon, XIcon } from "@heroicons/react/solid";
import { ExclamationIcon } from "@heroicons/react/outline";
import { ReactComponent as JetpackBoostLogo } from "../../images/jetpack-boost-integration-logo.svg";
import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Link } from "@yoast/ui-library";
import { Card } from "./tailwind-components/card";

/* eslint-disable complexity */
/**
 * An integration for Jetpack Boost.
 *
 * @returns {WPElement} A card representing an integration for Jetpack Boost.
 */
export const JetpackBoostIntegration = () => {
	const IntegrationLogo = JetpackBoostLogo;

	const isJetpackBoostActive  = Boolean( window.wpseoIntegrationsData[ "jetpack-boost_active" ] );
	const isJetpackBoostPremium = Boolean( window.wpseoIntegrationsData[ "jetpack-boost_premium" ] );

	let claim = createInterpolateElement(
		sprintf(
			/* translators: 1: bold open tag; 2: Yoast SEO; 3: Jetpack Boost; 4: bold close tag. */
			__( "Speed up your site with %1$s%2$s and %3$s%4$s", "wordpress-seo" ),
			"<strong>",
			"Yoast SEO",
			"Jetpack Boost",
			"</strong>"
		), {
			strong: <strong />,
		}
	);
	if ( isJetpackBoostActive ) {
		claim = createInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: Jetpack Boost Premium ; 3: bold close tag. */
				__( "Speed up your site with %1$s%2$s%3$s", "wordpress-seo" ),
				"<strong>",
				"Jetpack Boost Premium",
				"</strong>"
			), {
				strong: <strong />,
			}
		);
	}

	let description = sprintf(
		/* translators: 1: Yoast, 2: Jetpack Boost, 3: Boost (short for Jetpack Boost). */
		__( "%1$s recommends using %2$s to speed up your site. Optimize CSS, defer non-essential Javascript, and lazy load images. Install %3$s, speed up your site, and improve its ranking!", "wordpress-seo" ),
		"Yoast",
		"Jetpack Boost",
		"Boost"
	);
	if ( isJetpackBoostActive && ! isJetpackBoostPremium ) {
		description = sprintf(
			/* translators: 1: Yoast, 2: Jetpack Boost, 3: Boost (short for Jetpack Boost). */
			__( "%1$s recommends using %2$s for automated Critical CSS generation. Whenever you change your site, %3$s will automatically regenerate your site’s Critical CSS and performance scores. Upgrade %3$s, speed up your site, and improve its ranking!", "wordpress-seo" ),
			"Yoast",
			"Jetpack Boost",
			"Boost"
		);
	}
	if ( isJetpackBoostActive && isJetpackBoostPremium ) {
		description = sprintf(
			/* translators: 1: Yoast, 2: Jetpack Boost, 3: Boost (short for Jetpack Boost). */
			__( "%1$s recommends using %2$s for automated Critical CSS generation. Whenever you change your site, %3$s will automatically regenerate your site’s Critical CSS and performance scores.", "wordpress-seo" ),
			"Yoast",
			"Jetpack Boost",
			"Boost"
		);
	}

	let learnMoreLinkText = sprintf(
		/* translators: Jetpack Boost. */
		__( "Get %s", "wordpress-seo" ),
		"Jetpack Boost"
	);
	if ( isJetpackBoostActive ) {
		learnMoreLinkText = sprintf(
			/* translators: Jetpack Boost. */
			__( "Upgrade %s", "wordpress-seo" ),
			"Jetpack Boost"
		);
	}
	if ( isJetpackBoostPremium ) {
		learnMoreLinkText = __( "Learn more", "wordpress-seo" );
	}

	let learnMoreLink = window.wpseoIntegrationsData[ "jetpack-boost_get_link" ];
	if ( isJetpackBoostActive ) {
		learnMoreLink = window.wpseoIntegrationsData[ "jetpack-boost_upgrade_link" ];
	}
	if ( isJetpackBoostPremium ) {
		learnMoreLink = window.wpseoIntegrationsData[ "jetpack-boost_learn_more_link" ];
	}

	return (
		<Card>
			<Card.Header>
				<Link
					href={ window.wpseoIntegrationsData[ "jetpack-boost_logo_link" ] }
					target="_blank"
				>
					{ IntegrationLogo && <IntegrationLogo
						alt={
							sprintf(
								/* translators: 1: Yoast SEO, 2: integration name */
								__( "%1$s integrates with %2$s", "wordpress-seo" ),
								"Yoast SEO",
								"Jetpack Boost"
							)
						}
						className={ `${ isJetpackBoostActive
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
				<Badge className="yst-absolute yst-top-2 yst-right-2">{ __( "New", "wordpress-seo" ) }</Badge>
			</Card.Header>
			<Card.Content>
				<div>
					<h4 className="yst-flex yst-items-center yst-text-base yst-mb-3 yst-font-medium yst-text-[#111827] yst-leading-tight">
						<span>{ claim }</span>
					</h4>
					<p> { description }
						{ learnMoreLink && <Link
							href={ learnMoreLink }
							className="yst-flex yst-items-center yst-mt-3 yst-no-underline yst-font-medium"
							target="_blank"
						>
							{ learnMoreLinkText }
							<span className="yst-sr-only">
								{
									/* translators: Hidden accessibility text. */
									__( "(Opens in a new browser tab)", "wordpress-seo" )
								}
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
				{ isJetpackBoostActive && ! isJetpackBoostPremium && <p className="yst-flex yst-items-center yst-justify-between">
					<span className="yst-text-slate-700 yst-font-medium">
						{ __( "Integration active, upgrade available", "wordpress-seo" ) }
					</span>
					<ExclamationIcon className="yst-h-5 yst-w-5 yst-text-amber-500 yst-flex-shrink-0" />
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
