import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Link, Title } from "@yoast/ui-library";
import { ReactComponent as StarHalf } from "../../../images/star-rating-half.svg";
import { ReactComponent as Star } from "../../../images/star-rating-star.svg";
import { ReactComponent as YoastSeoLogo } from "../../../images/Yoast_SEO_Icon.svg";
import { useSelectSettings } from "../hooks";
import { ReactComponent as G2Logo } from "./g2-logo-white-rgb.svg";

/**
 * @returns {JSX.Element} The premium upsell card.
 */
const PremiumUpsellCard = () => {
	const premiumLink = useSelectSettings( "selectLink", [], "https://yoa.st/jj" );
	const premiumUpsellConfig = useSelectSettings( "selectUpsellSettingsAsProps" );

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
	const getPremium = sprintf(
		/* translators: %s expands to "Yoast SEO" Premium */
		__( "Get %s", "wordpress-seo" ),
		"Yoast SEO Premium"
	);

	return (
		<div className="yst-p-6 yst-rounded-lg yst-text-white yst-bg-primary-500 yst-shadow">
			<figure
				className="yst-logo-square yst-w-16 yst-h-16 yst-mt-[-2rem] yst-mx-auto yst-overflow-hidden yst-border yst-border-white yst-rounded-xl yst-rounded-br-none"
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
				href={ premiumLink }
				target="_blank"
				rel="noopener"
				className="yst-flex yst-justify-center yst-gap-2 yst-mt-4 yst-px-4 sm:yst-px-0"
				{ ...premiumUpsellConfig }
			>
				{ getPremium }
				<ArrowNarrowRightIcon className="yst-w-4 yst-h-4" />
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

/**
 * @returns {JSX.Element} The recommendations sidebar.
 */
const SidebarRecommendations = () => {
	const academyLink = useSelectSettings( "selectLink", [], "https://yoa.st/3t6" );
	const academy = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %1$s expands to "Yoast SEO" academy, which is a clickable link. */
			__( "Want to learn SEO from Team Yoast? Check out our %1$s!", "wordpress-seo" ),
			"<link/>"
		),
		{
			// eslint-disable-next-line react/jsx-no-target-blank
			link: <a href={ academyLink } target="_blank" rel="noopener">Yoast SEO academy</a>,
		}
	), [] );

	return (
		<div className="xl:yst-max-w-3xl xl:yst-fixed xl:yst-right-8 xl:yst-w-[16rem]">
			<div className="yst-grid yst-grid-cols-1 sm:yst-grid-cols-2 min-[783px]:yst-grid-cols-1 lg:yst-grid-cols-2 xl:yst-grid-cols-1 yst-gap-4">
				<PremiumUpsellCard />
				<div className="yst-p-6 yst-space-y-3 yst-rounded-lg yst-bg-white yst-shadow">
					<Title as="h2" size="4" className="yst-text-base yst-text-primary-500">{ __( "Learn SEO", "wordpress-seo" ) }</Title>
					<p>
						{ academy }
						<br />
						{ __( "We have both free and premium online courses to learn everything you need to know about SEO.", "wordpress-seo" ) }
					</p>
					<Link href={ academyLink } className="yst-block" target="_blank" rel="noopener">
						{ sprintf(
							/* translators: %1$s expands to "Yoast SEO" academy */
							__( "Check out %1$s", "wordpress-seo" ),
							"Yoast SEO academy"
						) }
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SidebarRecommendations;
