/* eslint-disable complexity */
import { CheckCircleIcon } from "@heroicons/react/solid";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Card, Title, useSvgAria } from "@yoast/ui-library";
import classNames from "classnames";
import { BuyProduct } from "../actions/buy-product";
import { LearnMore } from "../actions/learn-more";
import { CardLink } from "../actions/card-link";

/**
 * Plans card badge component.
 *
 * @param {string} variant The variant of the badge (success or error).
 * @param {string} className Additional class names for the badge.
 * @param {React.ReactNode} children The content of the badge.
 *
 * @returns {JSX.Element} The element.
 */
const CardBadge = ( { variant, className, children } ) => <div className="yst-absolute yst-top-0 yst--translate-y-1/2 yst-w-full yst-text-center">
	<Badge size="small" className={ classNames( "yst-border", className ) } variant={ variant }>
		{ children }
	</Badge>
</div>;

/**
 * A badge component that highlights the current plan status.
 *
 * @param {boolean} hasHighlight Whether the card should have a highlight (shadow and border).
 * @param {boolean} isActiveHighlight Whether the card is an active plan, which will determine the badge color and highlight text.
 * @param {boolean} isBlackFridayPromotionActive Whether the Black Friday promotion is active.
 * @param {boolean} isLicenseRequired Whether the license is required for the product.
 *
 * @returns {?JSX.Element} The element or null if not current.
 */
const CardHighlightBadge = ( { hasHighlight, isActiveHighlight, isBlackFridayPromotionActive, isLicenseRequired } ) => {
	if ( ! isLicenseRequired ) {
		return hasHighlight && <CardBadge variant="success">
			{ __( "Active", "wordpress-seo" ) }
		</CardBadge>;
	}

	if ( ! hasHighlight ) {
		return isBlackFridayPromotionActive && <CardBadge className="yst-bg-black yst-text-amber-300 yst-border-amber-300">{ __( "30% off - Black Friday", "wordpress-seo" ) }</CardBadge>;
	}

	return <CardBadge variant={ isActiveHighlight ? "success" : "error" }>
		{ isActiveHighlight
			? __( "Current active plan", "wordpress-seo" )
			: __( "Plan not activated", "wordpress-seo" )
		}
	</CardBadge>;
};

/**
 * A base card component for displaying product information in the Yoast SEO plans.
 *
 * @param {boolean} [hasHighlight=false] Whether the card should have a highlight (shadow and border).
 * @param {boolean} [isActiveHighlight=false] Whether the card is an active plan, which will determine the badge color and highlight text.
 * @param {boolean} [isLicenseRequired=true] Whether the license required for the product.
 * @param {React.ReactNode} buttonOverride An optional section to specify the button content.
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
 * @param {React.ReactNode} learnMoreOverride The learn more content of the card.
 * @param {string} learnMoreLink The URL to learn more about the product.
 * @param {boolean} isBlackFridayPromotionActive Whether the Black Friday promotion is active.
 *
 * @returns {JSX.Element} The element.
 */
export const BaseCard = ( {
	hasHighlight = false,
	isActiveHighlight = false,
	isLicenseRequired = true,
	isManageAvailable,
	buttonOverride = null,
	header,
	title,
	description,
	listDescription = "",
	list,
	includes,
	buyLink,
	buyConfig,
	manageLink,
	learnMoreOverride = null,
	learnMoreLink,
	isBlackFridayPromotionActive,
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
					<Title as="h2">{ title }</Title>
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
				<Card.Footer className="yst-pt-4">
					{ includes && (
						<>
							<span className="yst-block yst-font-medium yst-leading-none">{ __( "Now includes:", "wordpress-seo" ) }</span>
							<span className="yst-text-xxs yst-text-slate-500">{ includes }</span>
							<hr className="yst-mt-4 yst-mb-6 yst-border-t yst-border-slate-200" />
						</>
					) }
					<div className="yst-flex yst-flex-col yst-gap-y-1">
						{ buttonOverride }
						{ ! buttonOverride && ( isManageAvailable
							? (
								<CardLink
									href={ manageLink }
									label={ sprintf(
										/* translators: %s expands to "MyYoast". */
										__( "Manage in %s", "wordpress-seo" ),
										"MyYoast"
									) }
								/>
							) : <BuyProduct href={ buyLink } { ...buyConfig } /> )
						}
						{ learnMoreOverride || <LearnMore className="yst-pb-0" href={ learnMoreLink } /> }
					</div>
				</Card.Footer>
			</Card>
			<CardHighlightBadge
				isLicenseRequired={ isLicenseRequired }
				hasHighlight={ hasHighlight }
				isActiveHighlight={ isActiveHighlight }
				isBlackFridayPromotionActive={ isBlackFridayPromotionActive }
			/>
		</div>
	);
};
