import { noop } from "lodash";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Title } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { ReactComponent as StarHalf } from "../../../images/star-rating-half.svg";
import { ReactComponent as Star } from "../../../images/star-rating-star.svg";
import { ReactComponent as YoastSeoLogo } from "../../../images/Yoast_SEO_Icon.svg";
// Note that the same logo in images has a width and height, which we do not want here.
import { ReactComponent as G2Logo } from "./g2-logo-white.svg";

/**
 * @param {string} link The link.
 * @param {Object} [linkProps] Extra link props.
 * @param {function} isPromotionActive Callback to get whether a promotion is active.
 * @returns {JSX.Element} The premium upsell card.
 */
export const PremiumUpsellCard = ( { link, linkProps, isPromotionActive } ) => {
	let info = useMemo( () => __( "Use AI to generate titles and meta descriptions, automatically redirect deleted pages, get 24/7 support, and much, much more!", "wordpress-seo" ), [] );
	let getPremium = createInterpolateElement(
		sprintf(
			/* translators: %1$s and %2$s expand to a span wrap to avoid linebreaks. %3$s expands to "Yoast SEO Premium". */
			__( "%1$sGet%2$s %3$s", "wordpress-seo" ),
			"<nowrap>",
			"</nowrap>",
			"Yoast SEO Premium"
		),
		{
			nowrap: <span className="yst-whitespace-nowrap" />,
		}
	);

	const isBlackFriday = isPromotionActive( "black-friday-2024-promotion" );

	if ( isBlackFriday ) {
		info = useMemo( () => __( "If you were thinking about upgrading, now's the time! 30% OFF ends 3rd Dec 11am (CET)", "wordpress-seo" ), [] );

		getPremium = createInterpolateElement(
			sprintf(
				/* translators: %1$s and %2$s expand to a span wrap to avoid linebreaks. %3$s expands to "Yoast SEO Premium". */
				__( "%1$sBuy%2$s %3$s", "wordpress-seo" ),
				"<nowrap>",
				"</nowrap>",
				"Yoast SEO Premium"

			),
			{
				nowrap: <span className="yst-whitespace-nowrap" />,
			}
		);
	}
	return (
		<div className="yst-p-6 yst-rounded-lg yst-text-white yst-bg-primary-500 yst-shadow">
			<figure
				className="yst-logo-square yst-w-16 yst-h-16 yst-mx-auto yst-overflow-hidden yst-border yst-border-white yst-rounded-xl yst-rounded-br-none yst-relative yst-z-10 yst-mt-[-2.6rem]"
			>
				<YoastSeoLogo />
			</figure>
			{ isBlackFriday && <div className="sidebar__sale_banner_container">
				<div className="sidebar__sale_banner">
					<span className="banner_text">{ __( "30% OFF - BLACK FRIDAY", "wordpress-seo" ) }</span>
				</div>
			</div> }
			<Title as="h2" className="yst-mt-6 yst-text-base yst-font-extrabold yst-text-white">
				{ getPremium }
			</Title>
			<p className="yst-mt-2">{ info }</p>
			<Button
				as="a"
				variant="upsell"
				href={ link }
				target="_blank"
				rel="noopener"
				className="yst-flex yst-justify-center yst-gap-2 yst-mt-4 focus:yst-ring-offset-primary-500"
				{ ...linkProps }
			>
				<span>{ isBlackFriday ? __( "Buy now", "wordpress-seo" ) : getPremium }</span>
				<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst-icon-rtl" />
			</Button>
			<p className="yst-text-center yst-text-xs yst-mx-2 yst-font-light yst-leading-5 yst-mt-2">
				{ ! isBlackFriday && <>
					{ __( "Only $/€/£99 per year (ex VAT)", "wordpress-seo" ) }
					<br />
				</> }
				{ __( "30-day money back guarantee.", "wordpress-seo" ) }
			</p>
			<hr className="yst-border-t yst-border-primary-300 yst-my-4" />
			<a
				className="yst-block yst-mt-4 yst-no-underline"
				href="https://www.g2.com/products/yoast-yoast/reviews"
				target="_blank"
				rel="noopener noreferrer"
			>
				<span className="yst-font-medium yst-text-white hover:yst-underline">
					{ __( "Read reviews from real users", "wordpress-seo" ) }
				</span>
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
