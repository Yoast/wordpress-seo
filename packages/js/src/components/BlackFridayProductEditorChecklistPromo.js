import { __, sprintf } from "@wordpress/i18n";
import { select } from "@wordpress/data";
import { createInterpolateElement } from "@wordpress/element";
import { addQueryArgs } from "@wordpress/url";

import { ReactComponent as DefaultImage } from "../../../../images/succes_marieke_bubble_optm.svg";
import { TimeConstrainedNotification } from "./TimeConstrainedNotification";

/**
 * The BlackFridayProductEditorChecklistPromo component.
 *
 * @returns {JSX.Element} The BlackFridayProductEditorChecklistPromo component.
 */
export const BlackFridayProductEditorChecklistPromo = () => {
	const linkParams = select( "yoast-seo/editor" ).selectLinkParams();

	return (
		<TimeConstrainedNotification
			id="black-friday-2023-product-editor-checklist"
			alertKey="black-friday-2023-product-editor-checklist"
			promoId="black_friday_2023_checklist"
			store="yoast-seo/editor"
			title={ __( "Is your WooCommerce store ready for Black Friday?", "wordpress-seo" ) }
			image={ DefaultImage }
		>
			{ createInterpolateElement(
				sprintf(
					/* translators: %1$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
					__( "The Yoast %1$sultimate Black Friday checklist%2$s helps you prepare in time, so you can boost your results during this sale.", "wordpress-seo" ),
					"<strong>",
					"</strong>" ),
				{
					strong: <strong />,
				}
			) }
			&nbsp;<a href={ addQueryArgs( "https://yoa.st/black-friday-checklist", linkParams ) } target="_blank" rel="noreferrer">
				{ __( "Get the checklist and start optimizing now!", "wordpress-seo" ) }
			</a>
		</TimeConstrainedNotification>
	);
};
