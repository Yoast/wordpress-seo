import { useSelect } from "@wordpress/data";
import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import PropTypes from "prop-types";

import { TimeConstrainedNotification } from "./TimeConstrainedNotification";

/**
 * The BlackFridaySidebarChecklistPromotion component.
 *
 * @param {string} store The store to use. Defaults to {@code yoast-seo/editor
 * @param {Object} props The props.
 *
 * @returns {JSX.Element} The BlackFridaySidebarChecklistPromotion component.
 */
export const BlackFridaySidebarChecklistPromotion = ( {
	store = "yoast-seo/editor",
	...props
} ) => {
	const linkParams = useSelect( select => select( store ).selectLinkParams(), [ store ] );
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
			id="black-friday-2023-sidebar-checklist"
			promoId="black-friday-2023-checklist"
			alertKey="black-friday-2023-sidebar-checklist"
			store={ store }
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

BlackFridaySidebarChecklistPromotion.propTypes = {
	store: PropTypes.string,
};
