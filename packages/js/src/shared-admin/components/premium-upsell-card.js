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
 * @returns {JSX.Element} The premium upsell card.
 */
export const PremiumUpsellCard = ( { link, linkProps } ) => {
	const info = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %1$s and %2$s expand to opening and closing <strong> tags. */
			__( "Be the first to get %1$snew features & tools%2$s, before everyone else. Get %1$s24/7 support%2$s and boost your website’s visibility.", "wordpress-seo" ),
			"<strong>",
			"</strong>"
		),
		{
			strong: <strong />,
		}
	), [] );
	const getPremium = createInterpolateElement(
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

	return (
		<div className="yst-p-6 yst-rounded-lg yst-text-white yst-bg-primary-500 yst-shadow">
			<figure
				className="yst-logo-square yst-w-16 yst-h-16 yst-mt-[-2.6rem] yst-mx-auto yst-overflow-hidden yst-border yst-border-white yst-rounded-xl yst-rounded-br-none"
			>
				<YoastSeoLogo />
			</figure>
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
				<span>{ getPremium }</span>
				<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst-icon-rtl" />
			</Button>
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
};

PremiumUpsellCard.defaultProps = {
	linkProps: {},
};
