import { __, sprintf } from "@wordpress/i18n";
import { select } from "@wordpress/data";
import { addQueryArgs } from "@wordpress/url";
import { createInterpolateElement } from "@wordpress/element";
import PropTypes from "prop-types";
import { TimeConstrainedNotification } from "./TimeConstrainedNotification";

/**
 * The BlackFridaySalePromo component.
 *
 * @param {string} store The store to use. Defaults to {@code yoast-seo/editor}
 * @param {string} location Where the notice will be shown. Defaults to {@code sidebar}
 * @param {Object} props The props.
 *
 * @returns {JSX.Element} The BlackFridaySalePromo component.
 */
export const BlackFridaySalePromo = ( {
	store = "yoast-seo/editor",
	location = "sidebar",
	...props
} ) => {
	const isPremium = select( store ).getIsPremium();
	const linkParams = select( store ).selectLinkParams();
	const title = location === "sidebar"
		? __( "BLACK FRIDAY SALE: YOAST SEO PREMIUM", "wordpress-seo" )
		: createInterpolateElement(
			sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
				__( "BLACK FRIDAY SALE: YOAST SEO PREMIUM %1$sBuy now!%2$s", "wordpress-seo" ),
				"<a>",
				"</a>"
			),
			{
				// eslint-disable-next-line jsx-a11y/anchor-has-content
				a: <a href={ addQueryArgs( "https://yoa.st/black-friday-sale", linkParams ) } target="_blank" rel="noreferrer" />,
			}
		);
	return isPremium ? null : (
		<TimeConstrainedNotification
			id={ `black-friday-2023-sale-${location}` }
			promoId="black_friday_2023_sale"
			alertKey="black-friday-2023-sale"
			store={ store }
			title={ title }
			image={ Image }
			{ ...props }
		>
			<span className="yoast-bf-sale-badge">30% OFF!</span>
			{ location === "sidebar" && <a href={ addQueryArgs( "https://yoa.st/black-friday-sale", linkParams ) } target="_blank" rel="noreferrer">
				 { __( "Buy now!", "wordpress-seo" ) }
			</a> }
		</TimeConstrainedNotification>
	);
};

BlackFridaySalePromo.propTypes = {
	store: PropTypes.string,
	location: PropTypes.oneOf( [ "sidebar", "metabox" ] ),
};
