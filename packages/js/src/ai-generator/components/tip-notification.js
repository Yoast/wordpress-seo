import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Notifications, useToggleState } from "@yoast/ui-library";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { CONTENT_TYPE, EDIT_TYPE, MIN_CHARACTERS_DEFAULT, MIN_CHARACTERS_IRREGULAR, STORE_NAME_EDITOR } from "../constants";
import { useTypeContext } from "../hooks";

const ALERT_KEY = "ai_generator_tip_notification";

/**
 * Returns the minimum content length in characters for the given post type and content type.
 * @param {string} postType The current post type.
 * @param {string} contentType The current content type.
 * @param {boolean} isWooCommerceActive Whether WooCommerce is active.
 * @returns {number} The minimum content length.
 */
const getMinimumContentLength = ( isWooProductEntity, contentType ) =>
	isWooProductEntity || contentType === CONTENT_TYPE.term
		? MIN_CHARACTERS_IRREGULAR
		: MIN_CHARACTERS_DEFAULT;

/**
 * The tip notification for increasing the content.
 *
 * @returns {JSX.Element} The element.
 */
export const TipNotification = () => {
	const isDismissed = useSelect( select => select( STORE_NAME_EDITOR ).isAlertDismissed( ALERT_KEY ), [] );
	const content = useSelect( select => select( STORE_NAME_EDITOR ).getEditorDataContent(), [] );
	const isWooProductEntity = useSelect( select => select( STORE_NAME_EDITOR ).getIsWooProductEntity(), [] );
	const [ isIgnored, , , setIgnoredTrue ] = useToggleState( false );
	const { editType, contentType } = useTypeContext();
	const { dismissAlert } = useDispatch( STORE_NAME_EDITOR );

	const handleDismiss = useCallback( () => {
		dismissAlert( ALERT_KEY );
	}, [ dismissAlert ] );

	const tip = useMemo( () => {
		if ( editType === EDIT_TYPE.description ) {
			/* translators: %1$s and %2$s expand to opening and closing of a span in order to emphasise the word. */
			return __(
				"%1$sTip%2$s: Improve the accuracy of your generated AI descriptions by writing more content in your page.",
				"wordpress-seo"
			);
		}
		/* translators: %1$s and %2$s expand to opening and closing of a span in order to emphasise the word. */
		return __(
			"%1$sTip%2$s: Improve the accuracy of your generated AI titles by writing more content in your page.",
			"wordpress-seo"
		);
	}, [ editType ] );

	const minimumContentLength = useMemo( () => getMinimumContentLength( isWooProductEntity, contentType ),
		[ contentType, isWooProductEntity ] );

	// If the tip is dismissed or ignored, or the content length is greater than the minimum required, don't show the tip.
	if ( isDismissed || isIgnored || content.length > minimumContentLength ) {
		// Bail to not show the tip notification.
		return null;
	}

	return (
		<Notifications.Notification
			id="ai-generator-content-tip"
			variant="info"
			dismissScreenReaderLabel={ __( "Dismiss", "wordpress-seo" ) }
		>
			{ safeCreateInterpolateElement(
				sprintf( tip, "<span>", "</span>" ),
				{
					span: <span className="yst-font-medium yst-text-slate-800" />,
				}
			) }
			<div className="yst-flex yst-mt-3 yst--ms-3 yst-gap-1">
				<Button type="button" variant="tertiary" onClick={ handleDismiss }>
					{ __( "Don’t show again", "wordpress-seo" ) }
				</Button>
				<Button type="button" variant="tertiary" className="yst-text-slate-800" onClick={ setIgnoredTrue }>
					{ __( "Dismiss", "wordpress-seo" ) }
				</Button>
			</div>
		</Notifications.Notification>
	);
};
