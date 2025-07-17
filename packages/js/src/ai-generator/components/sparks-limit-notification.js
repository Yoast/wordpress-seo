import { LockOpenIcon } from "@heroicons/react/outline";
import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import { Button, Notifications, useSvgAria, useToggleState } from "@yoast/ui-library";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../constants";

const CLASSNAMES = {
	paragraph: "yst-mt-1 yst-mb-3",
	buttonContainer: "yst-flex yst-justify-end yst--me-8 yst-gap-3",
};

/**
 * @param {Function} onClose Callback function to close the notification.
 * @returns {JSX.Element} The content for the sparks limit notification.
 */
const SparksLimitContent = ( { onClose } ) => (
	<>
		<p className={ CLASSNAMES.paragraph }>
			{ __( "As long as this is a beta feature, you get unlimited sparks.", "wordpress-seo" ) }
		</p>
		<div className={ CLASSNAMES.buttonContainer }>
			<Button type="button" variant="primary" size="small" onClick={ onClose }>
				{ __( "Got it!", "wordpress-seo" ) }
			</Button>
		</div>
	</>
);

/**
 * @param {Function} onClose Callback function to close the notification.
 * @param {string} upsellLink The link to the upsell page.
 * @param {string} [upsellLabel] The label for the upsell.
 * @param {string} [ctbId] The click to buy ID for the upsell.
 * @returns {JSX.Element} The content with upsell for the sparks limit notification.
 */
const SparksLimitUpsellContent = ( {
	onClose,
	upsellLink,
	upsellLabel = sprintf(
		/* translators: %1$s expands to Yoast SEO Premium. */
		__( "Unlock with %1$s", "wordpress-seo" ),
		"Yoast SEO Premium"
	),
	ctbId = "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
} ) => {
	const svgAriaProps = useSvgAria();

	return (
		<>
			<p className={ CLASSNAMES.paragraph }>
				{ sprintf(
					/* translators: %s expands to Yoast SEO Premium. */
					__( "Keep the momentum going, unlock unlimited sparks with %s!", "wordpress-seo" ),
					"Yoast SEO Premium"
				) }
			</p>
			<div className={ CLASSNAMES.buttonContainer }>
				<Button type="button" variant="tertiary" size="small" onClick={ onClose }>
					{ __( "Close", "wordpress-seo" ) }
				</Button>
				<Button
					as="a"
					size="small"
					variant="upsell"
					href={ upsellLink }
					target="_blank"
					rel="noopener noreferrer"
					data-action="load-nfd-ctb"
					data-ctb-id={ ctbId }
				>
					<LockOpenIcon className="yst-w-4 yst-h-4 yst--ms-1 yst-me-2 yst-shrink-0" { ...svgAriaProps } />
					{ upsellLabel }
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Button>
			</div>
		</>
	);
};

/**
 * The notification component when the user has reached the limit of the AI.
 *
 * @param {string} [className=""] The class name.
 *
 * @returns {JSX.Element} The element.
 */
export const SparksLimitNotification = ( { className = "" } ) => {
	const {
		isUsageCountLimitReached,
		usageCount,
		usageCountLimit,
		isPremium,
		premiumUpsellLink,
		wooUpsellLink,
		isProductEntity,
	} = useSelect( ( select ) => {
		const aiSelect = select( STORE_NAME_AI );
		const editorSelect = select( STORE_NAME_EDITOR );
		return ( {
			isUsageCountLimitReached: aiSelect.isUsageCountLimitReached(),
			usageCount: aiSelect.selectUsageCount(),
			usageCountLimit: aiSelect.selectUsageCountLimit(),
			isPremium: editorSelect.getIsPremium(),
			premiumUpsellLink: editorSelect.selectLink( "https://yoa.st/ai-toast-out-of-free-sparks" ),
			wooUpsellLink: editorSelect.selectLink( "https://yoa.st/ai-toast-out-of-free-sparks-woo" ),
			isProductEntity: editorSelect.getIsProductEntity(),
		} );
	}, [] );
	const [ showNotification, , setShowNotification, , hideNotification ] = useToggleState( usageCount === usageCountLimit );

	useEffect( () => {
		const showNotificationPremium = isPremium && usageCount === usageCountLimit;
		const showNotificationFree = ! isPremium && isUsageCountLimitReached;
		setShowNotification( showNotificationPremium || showNotificationFree );
	}, [ usageCount, usageCountLimit ] );

	const upsellLink = isProductEntity ? wooUpsellLink : premiumUpsellLink;
	const upsellLabel = sprintf(
		/* translators: %1$s expands to Yoast SEO Premium. */
		__( "Unlock with %1$s", "wordpress-seo" ),
		isProductEntity ? "Yoast WooCommerce SEO" : "Yoast SEO Premium"
	);

	return showNotification && (
		<Notifications.Notification
			id="ai-sparks-limit"
			className={ className }
			variant="info"
			dismissScreenReaderLabel={ __( "Close", "wordpress-seo" ) }
			title={ isPremium
				? sprintf(
					/* translators: %s is the number of the sparks. */
					_n(
						"You've used %s spark this month.",
						"You've used %s sparks this month.",
						usageCountLimit,
						"wordpress-seo"
					),
					usageCountLimit
				)
				: __( "You're out of free sparks!", "wordpress-seo" )
			}
			size={ isPremium ? "default" : "large" }
		>
			{ isPremium
				? <SparksLimitContent onClose={ hideNotification } />
				: <SparksLimitUpsellContent onClose={ hideNotification } upsellLink={ upsellLink } upsellLabel={ upsellLabel } />
			}
		</Notifications.Notification>
	);
};
