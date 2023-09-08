import { select } from "@wordpress/data";
import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";

import { TimeConstrainedNotification } from "./TimeConstrainedNotification";

/**
 * @param {string} store The Redux store identifier from which to determine dismissed state.
 * @param {JSX.Element} image The image or null if no image.
 * @param {string} url The URL for the register now link.
 *
 * @returns {JSX.Element} The BlackFridayPromoNotification component.
 */
const BlackFridayPromoNotification = ( {
	...props
} ) => {
	const linkParams = select( "yoast-seo/editor" ).selectLinkParams();
	const body = createInterpolateElement(
		sprintf(
		/* translators:  %1$s expands to Yoast, %2$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
			__( "The %1$s %2$sultimate Black Friday checklist%3$s helps you prepare in time, so you can boost your results during this sale.", "wordpress-seo" ),
			"Yoast",
			"<strong>",
			"</strong>" ),
		{
			strong: <strong />,
		}
	);
	return (
		<TimeConstrainedNotification

			alertKey="black-friday-promo-notification"
			store="yoast-seo/editor"
			id="black-friday-promo-notification"
			promoId="black_friday_2023_checklist"
			title={ __( "Is your WooCommerce store ready for Black Friday?", "wordpress-seo" ) }
			{ ...props }
		>
			{ body }
			&nbsp;<a href={ addQueryArgs( "https://yoa.st/black-friday-checklist", linkParams ) } target="_blank" rel="noreferrer">
				{ __( "Get the checklist and start optimizing now!", "wordpress-seo" ) }
			</a>
		</TimeConstrainedNotification>
	);
};

export default BlackFridayPromoNotification;
