import { __ } from "@wordpress/i18n";
import { select } from "@wordpress/data";
import { addQueryArgs } from "@wordpress/url";

import { TimeConstrainedNotification } from "./TimeConstrainedNotification";

/**
 * The BlackFridaySaleNotification component.
 *
 * @param {Object} props The props.
 *
 * @returns {JSX.Element} The BlackFridaySaleNotification component.
 */
export const BlackFridaySaleNotification = ( {
	...props
} ) => {
	const isPremium = select( "yoast-seo/editor" ).getIsPremium();
	const linkParams = select( "yoast-seo/editor" ).selectLinkParams();

	return isPremium ? null : (
		<TimeConstrainedNotification
			id="black-friday-2023-sale"
			promoId="black_friday_2023_sale"
			alertKey="black-friday-2023-sale"
			store={ "yoast-seo/editor" }
			title={ __( "BLACK FRIDAY SALE: YOAST SEO PREMIUM", "wordpress-seo" ) }
			image={ Image }
			{ ...props }
		>
			<span className="yoast-bf-sale-badge">30% OFF!</span>
			<a href={ addQueryArgs( "https://yoa.st/black-friday-sale", linkParams ) } target="_blank" rel="noreferrer">
				{ __( "Buy now!", "wordpress-seo" ) }
			</a>
		</TimeConstrainedNotification>
	);
};
