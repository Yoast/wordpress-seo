import { Card } from "./tailwind-components/card";
import { Badge, Link } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { ArrowSmRightIcon, CheckIcon } from "@heroicons/react/solid";
import { PropTypes } from "prop-types";

/* eslint-disable complexity */
/**
 * Represents an integration.
 *
 * @param {object}     integration The integration.
 * @param {boolean}    isActive    The integration state.
 * @param {wp.Element} children    The child components.
 *
 * @returns {WPElement} A card representing an integration.
 */
export const SimpleIntegration = ( { integration, isActive, children } ) => {
	const IntegrationLogo = integration.logo;

	return (
		<Card>
			<Card.Header>
				<Link
					href={ integration.logoLink }
					target="_blank"
				>
					{ integration.logo && <IntegrationLogo alt={ `${integration.name} logo` } className={ `${ isActive ? "" : "yst-opacity-50 yst-filter yst-grayscale" }` } /> }
					<span className="yst-sr-only">
						{
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Link>
				{ ( integration.isNew ) && <Badge className="yst-absolute yst-top-2 yst-right-2">{ __( "New", "wordpress-seo" ) }</Badge> }
			</Card.Header>
			<Card.Content>
				<div>
					<h4 className="yst-flex yst-items-center yst-text-base yst-mb-3 yst-font-medium yst-text-[#111827] yst-leading-tight">
						<span>{ integration.claim }</span>
					</h4>
					{ integration.description && <p> { integration.description } </p> }
					{ integration.usps && <ul className="yst-space-y-3">
						{ integration.usps.map( ( usp, idx ) => {
							return (
								<li key={ idx } className="yst-flex yst-items-start">
									<CheckIcon
										className="yst-h-5 yst-w-5 yst-mr-2 yst-text-green-400 yst-flex-shrink-0"
									/>
									<span> { usp } </span>
								</li>
							);
						} ) }
					</ul> }
					{ integration.learnMoreLink && <Link
						href={ integration.learnMoreLink }
						className="yst-flex yst-items-center yst-mt-3 yst-no-underline yst-font-medium"
						target="_blank"
					>
						Learn more
						<span className="yst-sr-only">
							{
								__( "(Opens in a new browser tab)", "wordpress-seo" )
							}
						</span>
						<ArrowSmRightIcon className="yst-h-4 yst-w-4 yst-ml-1 yst-icon-rtl" />
					</Link> }
				</div>
			</Card.Content>
			<Card.Footer>
				<p className="yst-flex yst-items-start yst-justify-between">
					{ children }
				</p>
			</Card.Footer>
		</Card>
	);
};
/* eslint-enable complexity */

SimpleIntegration.propTypes = {
	integration: PropTypes.shape( {
		name: PropTypes.string,
		claim: PropTypes.string,
		learnMoreLink: PropTypes.string,
		logoLink: PropTypes.string,
		slug: PropTypes.string,
		description: PropTypes.string,
		usps: PropTypes.array,
		logo: PropTypes.func.isRequired,
		isNew: PropTypes.bool,
	} ).isRequired,
	isActive: PropTypes.bool,
	children: PropTypes.oneOfType( [
		PropTypes.node,
		PropTypes.arrayOf( PropTypes.node ),
	] ),
};

SimpleIntegration.defaultProps = {
	isActive: true,
	children: [],
};
