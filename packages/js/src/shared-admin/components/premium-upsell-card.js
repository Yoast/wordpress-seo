import { CheckCircleIcon, ArrowNarrowRightIcon } from "@heroicons/react/solid";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { getPremiumBenefits, getWooSeoBenefits } from "../../helpers/get-premium-benefits";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { Button, Title } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { ReactComponent as YoastSeoLogo } from "../../../images/yoast-premium-logo-new.svg";
import { ReactComponent as WooSeoLogo } from "../../../images/woo-seo-logo-new.svg";
// Note that the same logo in images has a width and height, which we do not want here.
import classNames  from "classnames";

/**
 * @param {string} link The link.
 * @param {Object} linkProps Extra link props.
 * @param {function} isPromotionActive Callback to get whether a promotion is active.
 * @param {boolean} isWooCommerceActive Whether WooCommerce is active.
 * @returns {JSX.Element} The premium upsell card.
 */
export const PremiumUpsellCard = ( { link, linkProps, isPromotionActive, isWooCommerceActive } ) => {
	const getBenefits = isWooCommerceActive
		? getWooSeoBenefits
		: getPremiumBenefits;
	const infoSubHeader = useMemo( () => {
		if ( isWooCommerceActive ) {
			return	__( "Grow your store's visibility!", "wordpress-seo" );
		}
		return __( "Spend less time on SEO tasks!", "wordpress-seo" );
	}, [ isWooCommerceActive ] );
	const info = useMemo( () => {
		if ( isWooCommerceActive ) {
			return	__( "Help ready-to-buy shoppers and search engines find your product.", "wordpress-seo" );
		}
		return __( "Optimize your site faster, smarter, and with more confidence.", "wordpress-seo" );
	}, [ isWooCommerceActive ] );
	let upsellButtonText = __( "Buy now", "wordpress-seo" );
	const microCopy = useMemo( () => {
		if ( isWooCommerceActive ) {
			return	__( "Less friction. Smarter optimization.", "wordpress-seo" );
		}
		return __( "Less friction. Faster publishing.", "wordpress-seo" );
	}, [ isWooCommerceActive ] );
	const upsellTitle = isWooCommerceActive
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
			className={ classNames( "yst-p-6 yst-rounded-lg yst-text-slate-600 yst-bg-white yst-shadow yst-border",
				isWooCommerceActive ? "yst-border-woo-light yst-border-opacity-50" : "yst-border-primary-300"
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
			<Title
				as="h2"
				className={ classNames( "yst-mt-6 yst-text-xl yst-font-semibold",
					isWooCommerceActive ? "yst-text-woo-light" : "yst-text-primary-500" )
				}
			>
				{ upsellTitle }
			</Title>
			<p className="yst-mt-3 yst-font-medium yst-text-slate-800">{ infoSubHeader }</p>
			<p className="yst-mt-1 yst-font-normal">{ info }</p>
			<ul className="yst-list-outside yst-text-slate-600 yst-mt-4 yst-flex yst-flex-col yst-gap-2">
				{ getBenefits( true ).map( ( benefit, index ) => (
					<li key={ `upsell-benefit-${ index }` } className="yst-flex yst-items-start">
						<CheckCircleIcon className="yst-mr-2 yst-text-green-500 yst-w-[19.5px] yst-h-[19.5px] yst-flex-shrink-0" />
						{ benefit }
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
				<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst--ms-1 yst-shrink-0" />
			</Button>
			<p className="yst-text-center yst-text-xs yst-font-normal yst-leading-5 yst-text-slate-500 yst-italic yst-mt-3 yst-mb-2">
				{ microCopy }
			</p>
			<hr className="yst-border-t yst-border-slate-200 yst-my-4" />
			<ul className="yst-text-center yst-text-xs yst-font-medium yst-text-slate-800 yst-list-none">
				<li>{ __( "30-day money back guarantee", "wordpress-seo" ) }</li>
				<li>{ __( "24/7 support", "wordpress-seo" ) }</li>
			</ul>
		</div>
	);
};

PremiumUpsellCard.propTypes = {
	link: PropTypes.string.isRequired,
	linkProps: PropTypes.object.isRequired,
	isPromotionActive: PropTypes.func.isRequired,
};
