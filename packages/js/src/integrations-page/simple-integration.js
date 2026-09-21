/* eslint-disable complexity */
import LockOpenIcon from "@heroicons/react/outline/LockOpenIcon";
import ArrowSmRightIcon from "@heroicons/react/solid/ArrowSmRightIcon";
import CheckIcon from "@heroicons/react/solid/CheckIcon";
import { useSelect } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Badge, Button, Link } from "@yoast/ui-library";
import { get } from "lodash";
import { PropTypes } from "prop-types";
import { getIsFreeIntegrationOrPremiumAvailable } from "./helper";
import { Card } from "./tailwind-components/card";

/**
 * Represents an integration.
 *
 * @param {Object} integration The integration.
 * @param {boolean} [isActive=true] The integration state.
 * @param {boolean} [isSchemaPartner=false] Whether the card is a Yoast Schema API partner.
 * @param {boolean} [showSchemaFrameworkAlertInBody=false] Whether a Schema API partner shows the Schema Framework alert in the card's
 *   body, alongside its children, instead of in the footer, in place of its children.
 * @param {React.ReactNode} [children=null] The child components.
 *
 * @returns {JSX.Element} A card representing an integration.
 */
export const SimpleIntegration = ( {
	integration,
	isActive = true,
	isSchemaPartner = false,
	showSchemaFrameworkAlertInBody = false,
	children = null,
} ) => {
	const IntegrationLogo = integration.logo;
	const isSchemaFrameworkDisabled = isSchemaPartner && ! get( window, "wpseoIntegrationsData.schema_framework_enabled", false );
	const showAlertInFooter = isSchemaFrameworkDisabled && ! showSchemaFrameworkAlertInBody;
	const showAlertInBody = isSchemaFrameworkDisabled && showSchemaFrameworkAlertInBody;

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
						alt={ `${integration.name} logo` }
						// If the schema is disabled we want to gray out the logo eventhough the plugin is active.
						className={ `${ isActive && ! showAlertInFooter ? "" : "yst-opacity-50 yst-filter yst-grayscale" }` }
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
					{ isSchemaPartner && <Badge
						variant="plain"
						size="small"
						className="yst-mb-2"
					>
						{ __( "Schema partner", "wordpress-seo" ) }
					</Badge> }
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
					{ showAlertInBody && <Fragment>
						<hr className="yst-my-4" />
						<p>
							<Link
								id={ `${ integration.slug }-schema-framework-link` }
								href="admin.php?page=wpseo_page_settings#/schema-framework"
								variant="error"
								className="yst-font-medium"
							>
								{ __( "Schema framework not active", "wordpress-seo" ) }
								<span className="yst-sr-only">
									{
										/* translators: Hidden accessibility text. */
										__( "(Go to the Schema Framework settings)", "wordpress-seo" )
									}
								</span>
							</Link>
						</p>
					</Fragment> }
				</div>
			</Card.Content>
			<Card.Footer>
				{ ! showAlertInFooter && ! getIsFreeIntegrationOrPremiumAvailable( integration ) && <Button
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
				{ ( showAlertInFooter || getIsFreeIntegrationOrPremiumAvailable( integration ) ) && <p className="yst-flex yst-items-start yst-justify-between">
					{ showAlertInFooter && <Link
						id={ `${ integration.slug }-schema-framework-link` }
						href="admin.php?page=wpseo_page_settings#/schema-framework"
						variant="error"
						className="yst-font-medium"
					>
						{ __( "Schema Framework disabled", "wordpress-seo" ) }
						<span className="yst-sr-only">
							{
								/* translators: Hidden accessibility text. */
								__( "(Go to the Schema Framework settings)", "wordpress-seo" )
							}
						</span>
					</Link> }
					{ ! showAlertInFooter && children }
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
	isSchemaPartner: PropTypes.bool,
	showSchemaFrameworkAlertInBody: PropTypes.bool,
	children: PropTypes.oneOfType( [
		PropTypes.node,
		PropTypes.arrayOf( PropTypes.node ),
	] ),
};
