/* eslint-disable complexity */
import { CheckCircleIcon } from "@heroicons/react/solid";
import { __ } from "@wordpress/i18n";
import { Badge, Card, Title, useSvgAria } from "@yoast/ui-library";
import classNames from "classnames";
import { BuyProduct } from "../actions/buy-product";
import { LearnMore } from "../actions/learn-more";
import { ManageInMyYoast } from "../actions/manage-in-my-yoast";

/**
 * A badge component that highlights the current plan status.
 *
 * @param {boolean} hasHighlight Whether the card should have a highlight (shadow and border).
 * @param {boolean} isActiveHighlight Whether the card is an active plan, which will determine the badge color and highlight text.
 *
 * @returns {?JSX.Element} The element or null if not current.
 */
const CardHighlightBadge = ( { hasHighlight, isActiveHighlight } ) => {
	if ( ! hasHighlight ) {
		return null;
	}

	return (
		<div className="yst-absolute yst-top-0 yst--translate-y-1/2 yst-w-full yst-text-center">
			<Badge size="small" className="yst-border" variant={ isActiveHighlight ? "success" : "error" }>
				{ isActiveHighlight
					? __( "Current active plan", "wordpress-seo" )
					: __( "Plan not activated", "wordpress-seo" )
				}
			</Badge>
		</div>
	);
};

/**
 * A base card component for displaying product information in the Yoast SEO plans.
 *
 * @param {boolean} [hasHighlight=false] Whether the card should have a highlight (shadow and border).
 * @param {boolean} [isActiveHighlight=false] Whether the card is an active plan, which will determine the badge color and highlight text.
 * @param {boolean} isManageAvailable Whether the card action is to manage the product in MyYoast, otherwise it will be buy.
 * @param {React.ReactNode} header The header content of the card. An SVG is expected.
 * @param {string} title The title of the card, typically the product name.
 * @param {string} description The description of the product.
 * @param {string} [listDescription] An optional description for the list of features.
 * @param {string[]} list A list of features of the product.
 * @param {React.ReactNode} [includes] An optional section to specify the "Now includes" plugins.
 * @param {string} buyLink The URL to buy the product.
 * @param {...Object} buyConfig Additional configuration for the buy button, for the CTB attributes.
 * @param {string} manageLink The URL to manage the product in MyYoast.
 * @param {string} learnMoreLink The URL to learn more about the product.
 *
 * @returns {JSX.Element} The element.
 */
export const BaseCard = ( {
	hasHighlight = false,
	isActiveHighlight = false,
	isManageAvailable,
	header,
	title,
	description,
	listDescription = "",
	list,
	includes,
	buyLink,
	buyConfig,
	manageLink,
	learnMoreLink,
} ) => {
	const svgAriaProps = useSvgAria();

	return (
		<div className="yst-flex yst-relative yst-max-w-64">
			<Card
				className={ classNames(
					hasHighlight && "yst-shadow-md",
					hasHighlight && ( isActiveHighlight ? "yst-border-green-400" : "yst-border-red-400" )
				) }
			>
				<Card.Header className="yst-overflow-hidden yst-h-auto yst-p-0">{ header }</Card.Header>
				<Card.Content className="yst-flex yst-flex-col">
					<Title as="h3">{ title }</Title>
					<p className="yst-mt-3">{ description }</p>
					<hr className="yst-my-6 yst-border-t yst-border-slate-200" />
					{ listDescription && <p className="yst-mb-3">{ listDescription }</p> }
					<div className="yst-flex yst-flex-col yst-gap-y-2" role="list">
						{ list.map( ( item, index ) => (
							<div key={ `list-item--${ index }` } className="yst-flex yst-gap-x-2" role="listitem">
								<CheckCircleIcon className="yst-w-5 yst-h-5 yst-shrink-0 yst-text-green-500" { ...svgAriaProps } />
								{ item }
							</div>
						) ) }
					</div>
				</Card.Content>
				<Card.Footer>
					{ includes && (
						<>
							<span className="yst-block yst-font-medium">{ __( "Now includes:", "wordpress-seo" ) }</span>
							<span className="yst-text-xxs yst-text-slate-500">{ includes }</span>
							<hr className="yst-mt-4 yst-mb-6 yst-border-t yst-border-slate-200" />
						</>
					) }
					<div className="yst-flex yst-flex-col yst-gap-y-1">
						{ isManageAvailable
							? <ManageInMyYoast href={ manageLink } />
							: <BuyProduct href={ buyLink } { ...buyConfig } />
						}
						<LearnMore href={ learnMoreLink } />
					</div>
				</Card.Footer>
			</Card>
			<CardHighlightBadge hasHighlight={ hasHighlight } isActiveHighlight={ isActiveHighlight } />
		</div>
	);
};
