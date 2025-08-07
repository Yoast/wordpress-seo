/* eslint-disable complexity */
import { LockOpenIcon } from "@heroicons/react/outline";
import { ArrowSmRightIcon, CheckIcon } from "@heroicons/react/solid";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Badge, Button, Link } from "@yoast/ui-library";
import { PropTypes } from "prop-types";
import { getIsFreeIntegrationOrPremiumAvailable } from "./helper";
import { Card } from "./tailwind-components/card";

/**
 * Represents an integration.
 *
 * @param {Object} integration The integration.
 * @param {boolean} [isActive=true] The integration state.
 * @param {React.ReactNode} [children=null] The child components.
 *
 * @returns {JSX.Element} A card representing an integration.
 */
export const SimpleIntegration = ( { integration, isActive = true, children = null } ) => {
	const IntegrationLogo = integration.logo;

	const learnMoreLink = useSelect( select => select( "yoast-seo/settings" ).selectLink( integration.learnMoreLink ), [] );
	const logoLink = useSelect( select => select( "yoast-seo/settings" ).selectLink( integration.logoLink ), [] );

	return (
		<Card>
			<Card.Header>
				<Link
					href={ logoLink }
					target="_blank"
				>
					{ integration.logo && <IntegrationLogo
						alt={ `${ integration.name } logo` }
						className={ `${ isActive ? "" : "yst-opacity-50 yst-filter yst-grayscale" }` }
					/> }
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Link>
				{ ( integration.isNew ) && <Badge className="yst-absolute yst-top-2 yst-end-2">{ __( "New", "wordpress-seo" ) }</Badge> }
			</Card.Header>
			<Card.Content>
				<div>
					{ integration.claim && <h4 className="yst-text-base yst-mb-3 yst-font-medium yst-text-[#111827] yst-leading-tight">
						{ integration.claim }
					</h4> }
					{ integration.description && <p> { integration.description } </p> }
					{ integration.usps && <ul className="yst-space-y-3">
						{ integration.usps.map( ( usp, idx ) => {
							return (
								<li key={ idx } className="yst-flex yst-items-start">
									<CheckIcon
										className="yst-h-5 yst-w-5 yst-me-2 yst-text-green-400 yst-flex-shrink-0"
									/>
									<span> { usp } </span>
								</li>
							);
						} ) }
					</ul> }
					{ integration.learnMoreLink && <Link
						href={ learnMoreLink }
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
				</div>
			</Card.Content>
			<Card.Footer>
				{ ! getIsFreeIntegrationOrPremiumAvailable( integration ) && <Button
					id={ `${ integration.slug }-upsell-button` }
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
				{ getIsFreeIntegrationOrPremiumAvailable( integration ) && <p className="yst-flex yst-items-start yst-justify-between">
					{ children }
				</p> }
			</Card.Footer>
		</Card>
	);
};

SimpleIntegration.propTypes = {
	integration: PropTypes.shape( {
		name: PropTypes.string,
		claim: PropTypes.node,
		learnMoreLink: PropTypes.string,
		logoLink: PropTypes.string,
		slug: PropTypes.string,
		description: PropTypes.string,
		usps: PropTypes.array,
		logo: PropTypes.func.isRequired,
		isNew: PropTypes.bool,
		upsellLink: PropTypes.string,
	} ).isRequired,
	isActive: PropTypes.bool,
	children: PropTypes.oneOfType( [
		PropTypes.node,
		PropTypes.arrayOf( PropTypes.node ),
	] ),
};
