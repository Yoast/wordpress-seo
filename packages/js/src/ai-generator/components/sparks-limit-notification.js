import { LockOpenIcon } from "@heroicons/react/outline";
import { useSelect } from "@wordpress/data";
import { useEffect, useMemo } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import { Button, Notifications, useSvgAria, useToggleState } from "@yoast/ui-library";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../constants";

const CLASSNAMES = {
	paragraph: "yst-mt-1 yst-mb-3",
	buttonContainer: "yst-flex yst-justify-end yst--me-8 yst-gap-3 yst--ms-2",
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
 * @param {boolean} [isWooProductEntity=false] If its a product entity.
 * @param {string} [ctbId] The click to buy ID for the upsell.
 * @returns {JSX.Element} The content with upsell for the sparks limit notification.
 */
const SparksLimitUpsellContent = ( {
	onClose,
	upsellLink,
	isWooProductEntity = false,
	ctbId = "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
} ) => {
	const svgAriaProps = useSvgAria();

	return (
		<>
			<p className={ CLASSNAMES.paragraph }>
				{ sprintf(
					/* translators: %s expands to Yoast SEO Premium or Yoast WooCommerce SEO. */
					__( "Keep the momentum going, unlock unlimited sparks with %s!", "wordpress-seo" ),
					isWooProductEntity ? "Yoast WooCommerce SEO" : "Yoast SEO Premium"
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
					{ sprintf(
						/* translators: %1$s expands to Yoast SEO Premium or Yoast WooCommerce SEO. */
						__( "Unlock with %1$s", "wordpress-seo" ),
						isWooProductEntity ? "Yoast WooCommerce SEO" : "Yoast SEO Premium"
					) }
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
		premiumUpsellLink,
		wooUpsellLink,
		isWooProductEntity,
		hasValidPremiumSubscription,
		hasValidWooSubscription,
	} = useSelect( ( select ) => {
		const aiSelect = select( STORE_NAME_AI );
		const editorSelect = select( STORE_NAME_EDITOR );
		return ( {
			isUsageCountLimitReached: aiSelect.isUsageCountLimitReached(),
			usageCount: aiSelect.selectUsageCount(),
			usageCountLimit: aiSelect.selectUsageCountLimit(),
			premiumUpsellLink: editorSelect.selectLink( "https://yoa.st/ai-toast-out-of-free-sparks" ),
			wooUpsellLink: editorSelect.selectLink( "https://yoa.st/ai-toast-out-of-free-sparks-woo" ),
			isWooProductEntity: editorSelect.getisWooProductEntity(),
			hasValidPremiumSubscription: aiSelect.selectPremiumSubscription(),
			hasValidWooSubscription: aiSelect.selectWooCommerceSubscription(),
		} );
	}, [] );
	const hasUnlimitedSparks = useMemo( () =>
		( hasValidPremiumSubscription && ! isWooProductEntity ) || ( isWooProductEntity && hasValidWooSubscription ),
	[ hasValidPremiumSubscription, isWooProductEntity, hasValidWooSubscription ] );

	const [ showNotification, , setShowNotification, , hideNotification ] = useToggleState( usageCount === usageCountLimit );

	useEffect( () => {
		const showNotificationPremium = hasUnlimitedSparks && usageCount === usageCountLimit;
		const showNotificationFree = ! hasUnlimitedSparks && isUsageCountLimitReached;
		setShowNotification( showNotificationPremium || showNotificationFree );
	}, [ usageCount, usageCountLimit, hasUnlimitedSparks, isUsageCountLimitReached ] );

	const upsellLink = useMemo( () => isWooProductEntity ? wooUpsellLink : premiumUpsellLink,
		[ isWooProductEntity, wooUpsellLink, premiumUpsellLink ] );

	return showNotification && (
		<Notifications.Notification
			id="ai-sparks-limit"
			className={ className }
			variant="info"
			dismissScreenReaderLabel={ __( "Close", "wordpress-seo" ) }
			title={ hasUnlimitedSparks
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
			size={ hasUnlimitedSparks ? "default" : "large" }
		>
			{ hasUnlimitedSparks
				? <SparksLimitContent onClose={ hideNotification } />
				: <SparksLimitUpsellContent onClose={ hideNotification } upsellLink={ upsellLink } isWooProductEntity={ isWooProductEntity } />
			}
		</Notifications.Notification>
	);
};
