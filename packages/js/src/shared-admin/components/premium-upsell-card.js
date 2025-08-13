import { noop } from "lodash";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { getPremiumBenefits, getWooSeoBenefits } from "../../helpers/get-premium-benefits";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { Button, Title } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { ReactComponent as StarHalf } from "../../../images/star-rating-half.svg";
import { ReactComponent as Star } from "../../../images/star-rating-star.svg";
import { ReactComponent as YoastSeoLogo } from "../../../images/yoast-premium-logo-new.svg";
import { ReactComponent as WooSeoLogo } from "../../../images/woo-seo-logo-new.svg";
// Note that the same logo in images has a width and height, which we do not want here.
import { ReactComponent as G2Logo } from "./g2-logo-white.svg";
import { CheckIcon } from "@heroicons/react/solid";
import classNames  from "classnames";

/**
 * @param {string} link The link.
 * @param {Object} [linkProps] Extra link props.
 * @param {function} isPromotionActive Callback to get whether a promotion is active.
 * @param {boolean} isWooCommerceActive Whether WooCommerce is active.
 * @returns {JSX.Element} The premium upsell card.
 */
export const PremiumUpsellCard = ( { link, linkProps, isPromotionActive, isWooCommerceActive } ) => {
	const getBenefits = isWooCommerceActive
		? getWooSeoBenefits
		: getPremiumBenefits;
	let info = useMemo( () => __( "Now with Local, News & Video SEO + 1 Google Docs seat!", "wordpress-seo" ), [] );
	let upsellButtonText = __( "Buy now", "wordpress-seo" );
	let upsellTitle = isWooCommerceActive
		? safeCreateInterpolateElement(
			sprintf(
			/* translators: %1$s and %2$s expand to a span wrap to avoid linebreaks. %3$s expands to "Yoast SEO Premium". */
				__( "%1$s%2$s %3$s", "wordpress-seo" ),
				"<nowrap>",
				"</nowrap>",
				"Yoast WooCommerce SEO"
			),
			{
				nowrap: <span className="yst-whitespace-nowrap" />,
			}
		)
		: safeCreateInterpolateElement(
			sprintf(
				/* translators: %1$s and %2$s expand to a span wrap to avoid linebreaks. %3$s expands to "Yoast SEO Premium". */
				__( "%1$s%2$s %3$s", "wordpress-seo" ),
				"<nowrap>",
				"</nowrap>",
				"Yoast SEO Premium"
			),
			{
				nowrap: <span className="yst-whitespace-nowrap" />,
			}
		);
	const isBlackFriday = isPromotionActive( "black-friday-promotion" );

	if ( isBlackFriday ) {
		upsellButtonText = __( "Buy now for 30% off", "wordpress-seo" );
	}
	return (
		<div
			className={ classNames( "yst-p-6 yst-rounded-lg yst-text-white  yst-shadow",
				isWooCommerceActive ? "yst-bg-[#0e1e65]" : "yst-bg-primary-500"
			) }
		>
			<figure
				className="yst-logo-square yst-w-16 yst-h-16 yst-mx-auto yst-overflow-hidden yst-relative yst-z-10 yst-mt-[-2.6rem]"
			>
				{ isWooCommerceActive
					? <WooSeoLogo />
					: <YoastSeoLogo />
				}
			</figure>
			{ isBlackFriday && <div className="sidebar__sale_banner_container">
				<div className="sidebar__sale_banner">
					<span className="banner_text">{ __( "BLACK FRIDAY | 30% OFF", "wordpress-seo" ) }</span>
				</div>
			</div> }
			<Title as="h2" className="yst-mt-6 yst-text-base yst-font-extrabold yst-text-white">
				{ upsellTitle }
			</Title>
			<p className="yst-mt-2 yst-font-medium">{ info }</p>
			<ul className="yst-ps-[1em] yst-list-outside yst-text-white yst-mt-2">
				{ getBenefits( true ).map( ( benefit, index ) => (
					<li key={ `upsell-benefit-${ index }` } className="yst-flex yst-items-center yst-gap-2">
						<CheckIcon className="yst-w-4 yst-h-4 yst-text-green-400" />
						<span>{ benefit }</span>
					</li>
				) ) }
			</ul>
			<Button
				as="a"
				variant="upsell"
				href={ link }
				target="_blank"
				rel="noopener"
				className="yst-flex yst-justify-center yst-gap-2 yst-mt-4 focus:yst-ring-offset-primary-500"
				{ ...linkProps }
			>
				<span>{ upsellButtonText }</span>
				<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst-icon-rtl" />
			</Button>
			<p className="yst-text-center yst-text-xs yst-mx-2 yst-font-light yst-leading-5 yst-italic yst-mt-2">
				{ __( "30-day money back guarantee", "wordpress-seo" ) }
			</p>
			<hr className="yst-border-t yst-border-primary-300 yst-my-4" />
			<a
				className="yst-block yst-mt-4 yst-no-underline"
				href="https://www.g2.com/products/yoast-yoast/reviews"
				target="_blank"
				rel="noopener noreferrer"
			>
				<span className="yst-flex yst-gap-2 yst-mt-2 yst-items-center">
					<G2Logo className="yst-w-5 yst-h-5" />
					<span className="yst-flex yst-gap-1">
						<Star className="yst-w-5 yst-h-5" />
						<Star className="yst-w-5 yst-h-5" />
						<Star className="yst-w-5 yst-h-5" />
						<Star className="yst-w-5 yst-h-5" />
						<StarHalf className="yst-w-5 yst-h-5" />
					</span>
					<span className="yst-text-sm yst-font-semibold yst-text-white">4.6 / 5</span>
				</span>
			</a>
		</div>
	);
};

PremiumUpsellCard.propTypes = {
	link: PropTypes.string.isRequired,
	linkProps: PropTypes.object,
	isPromotionActive: PropTypes.func,
};

PremiumUpsellCard.defaultProps = {
	linkProps: {},
	isPromotionActive: noop,
};
