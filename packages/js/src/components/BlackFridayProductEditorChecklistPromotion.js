import { __, sprintf } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { createInterpolateElement } from "@wordpress/element";
import { addQueryArgs } from "@wordpress/url";

import { ReactComponent as DefaultImage } from "../../../../images/succes_marieke_bubble_optm.svg";
import { TimeConstrainedNotification } from "./TimeConstrainedNotification";

/**
 * The BlackFridayProductEditorChecklistPromotion component.
 *
 * @returns {JSX.Element} The BlackFridayProductEditorChecklistPromotion component.
 */
export const BlackFridayProductEditorChecklistPromotion = () => {
	const linkParams = useSelect( select => select( "yoast-seo/editor" ).selectLinkParams(), [] );
	const title = sprintf(
		/* translators: %1$s expands to 'WooCommerce'. */
		__( "Is your %1$s store ready for Black Friday?", "wordpress-seo" ),
		"WooCommerce"
	);
	return (
		<TimeConstrainedNotification
			id="black-friday-2023-product-editor-checklist"
			alertKey="black-friday-2023-product-editor-checklist"
			promoId="black-friday-2023-checklist"
			store="yoast-seo/editor"
			title={ title }
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
