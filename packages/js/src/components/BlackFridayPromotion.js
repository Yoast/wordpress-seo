import { useSelect } from "@wordpress/data";
import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import PropTypes from "prop-types";
import { TimeConstrainedNotification } from "./TimeConstrainedNotification";

/**
 * The BlackFridayPromotion component.
 *
 * @param {string} store The store to use. Defaults to {@code yoast-seo/editor}
 * @param {string} location Where the notice will be shown. Defaults to {@code sidebar}
 * @param {Object} props The props.
 *
 * @returns {JSX.Element} The BlackFridayPromotion component.
 */
export const BlackFridayPromotion = ( {
	store = "yoast-seo/editor",
	location = "sidebar",
	...props
} ) => {
	const isPremium = useSelect( select => select( store ).getIsPremium(), [ store ] );
	const linkParams = useSelect( select => select( store ).selectLinkParams(), [ store ] );
	const title = location === "sidebar"
		? sprintf(
			/* translators: %1$s expands to Yoast SEO Premium */
			__( "Now with 30%% OFF: %1$s", "wordpress-seo" ),
			"Yoast SEO Premium"
		)
		: createInterpolateElement(
			sprintf(
				/* translators: %1$s expands to Yoast SEO Premium, %2$s expands to a link on yoast.com, %3$s expands to the anchor end tag. */
				__( "Now with 30%% OFF: %1$s %2$sBuy now!%3$s", "wordpress-seo" ),
				"Yoast SEO Premium",
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
			id={ `black-friday-2024-promotion-${ location }` }
			promoId="black-friday-2024-promotion"
			alertKey="black-friday-2024-promotion"
			store={ store }
			title={ title }
			{ ...props }
		>
			<span className="yoast-bf-sale-badge">{ __( "BLACK FRIDAY SALE", "wordpress-seo" ) } </span>
			{ location === "sidebar" && <a
				// Styling is to counteract the WP paragraph margin-bottom.
				className="yst-block yst--mb-[1em]"
				href={ addQueryArgs( "https://yoa.st/black-friday-sale", linkParams ) }
				target="_blank"
				rel="noreferrer"
			>
				{ __( "Buy now!", "wordpress-seo" ) }
			</a> }
		</TimeConstrainedNotification>
	);
};

BlackFridayPromotion.propTypes = {
	store: PropTypes.string,
	location: PropTypes.oneOf( [ "sidebar", "metabox" ] ),
};
