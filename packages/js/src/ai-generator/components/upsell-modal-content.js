import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo, useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../constants";
import { useUpsellProps } from "../hooks";
import { LockOpenIcon } from "@heroicons/react/outline";
import { ArrowNarrowRightIcon } from "@heroicons/react/solid";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { Badge, Button, useModalContext, Alert } from "@yoast/ui-library";
import { OutboundLink, VideoFlow } from "../../shared-admin/components";
import { GradientButton } from "@yoast/ai-frontend";
import classNames from "classnames";

/**
 * @param {Function} onActivateFreeSparks The function to set the display state to show ai consent.
 *
 * @returns {JSX.Element} The element.
 */
export const UpsellModalContent = ( { onActivateFreeSparks } ) => {
	const {
		premiumUpsellLink,
		wooUpsellLink,
		isWooCommerceActive,
		isProductPost,
		learnMoreLink,
		imageLink,
		wistiaEmbedPermissionValue,
		wistiaEmbedPermissionStatus,
		isUsageCountLimitReached,
		activateFreeSparksEndpoint,
	} = useSelect( ( select ) => {
		const aiSelect = select( STORE_NAME_AI );
		const editorSelect = select( STORE_NAME_EDITOR );
		return {
			premiumUpsellLink: editorSelect.selectLink( "https://yoa.st/ai-generator-upsell" ),
			wooUpsellLink: editorSelect.selectLink( "https://yoa.st/ai-generator-upsell-woo-seo" ),
			isWooCommerceActive: editorSelect.getIsWooCommerceActive(),
			isProductPost: editorSelect.getIsProduct(),
			learnMoreLink: editorSelect.selectLink( "https://yoa.st/ai-generator-learn-more" ),
			imageLink: editorSelect.selectImageLink( "ai-generator-preview.png" ),
			wistiaEmbedPermissionValue: editorSelect.selectWistiaEmbedPermissionValue(),
			wistiaEmbedPermissionStatus: editorSelect.selectWistiaEmbedPermissionStatus(),
			isUsageCountLimitReached: aiSelect.isUsageCountLimitReached(),
			activateFreeSparksEndpoint: aiSelect.selectFreeSparksActiveEndpoint(),
		};
	}, [] );
	const { onClose, initialFocus } = useModalContext();

	const {
		title,
		upsellLabel,
		upsellLink,
		ctbId,
		newToText,
	} = useUpsellProps( { premium: premiumUpsellLink, woo: wooUpsellLink } );
	const isProductCopy = useMemo( () => isWooCommerceActive && isProductPost,
		[ isWooCommerceActive, isProductPost ] );

	const thumbnail = useMemo( () => ( {
		src: imageLink,
		width: "432",
		height: "244",
	} ), [ imageLink ] );

	const { setWistiaEmbedPermission } = useDispatch( STORE_NAME_EDITOR );
	const { activateFreeSparks } = useDispatch( STORE_NAME_AI );

	const wistiaEmbedPermission = useMemo( () => ( {
		value: wistiaEmbedPermissionValue,
		status: wistiaEmbedPermissionStatus,
		set: setWistiaEmbedPermission,
	} ), [ wistiaEmbedPermissionValue, wistiaEmbedPermissionStatus, setWistiaEmbedPermission ] );

	const handleStartTrial = useCallback( () => {
		activateFreeSparks( { endpoint: activateFreeSparksEndpoint } );
		onActivateFreeSparks();
	}, [ activateFreeSparks, activateFreeSparksEndpoint, onClose, onActivateFreeSparks ] );

	const learnMoreLinkStructure = {
		a: <OutboundLink
			href={ learnMoreLink }
			className="yst-inline-flex yst-items-center yst-gap-1 yst-no-underline yst-font-medium"
			variant="primary"
		/>,
		ArrowNarrowRightIcon: <ArrowNarrowRightIcon className="yst-w-4 yst-h-4 rtl:yst-rotate-180" />,
	};

	return <>
		<div className="yst-px-10 yst-pt-10 yst-introduction-gradient yst-text-center">
			<div className="yst-relative yst-w-full">
				<VideoFlow
					videoId="vmrahpfjxp"
					thumbnail={ thumbnail }
					wistiaEmbedPermission={ wistiaEmbedPermission }
				/>
				<Badge className="yst-absolute yst--top-2 yst-end-4" variant="info">Beta</Badge>
			</div>
			<div className="yst-mt-6 yst-text-xs yst-font-medium yst-flex yst-flex-col yst-items-center">
				<span className="yst-introduction-modal-uppercase yst-flex yst-gap-2 yst-items-center">
					<span className="yst-logo-icon" />
					{ newToText }
				</span>
			</div>
		</div>
		<div className="yst-px-10 yst-pb-4 yst-flex yst-flex-col yst-items-center">
			<div className="yst-mt-4 yst-mx-1.5 yst-text-center">
				<h3 className="yst-text-slate-900 yst-text-lg yst-font-medium">
					{ title }
				</h3>
				<div className="yst-mt-2 yst-text-slate-600 yst-text-sm">
					{ isProductCopy
						? safeCreateInterpolateElement(
							sprintf(
								/* translators: %1$s and %2$s are anchor tags; %3$s is the arrow icon. */
								__(
									"Let AI do some of the thinking for you and help you save time. Get high-quality suggestions for product titles and meta descriptions to make your content rank high and look good on social media. %1$sLearn more%2$s%3$s",
									"wordpress-seo"
								),
								"<a>",
								"<ArrowNarrowRightIcon />",
								"</a>"
							),
							learnMoreLinkStructure
						)
						: safeCreateInterpolateElement(
							sprintf(
								/* translators: %1$s and %2$s are anchor tags; %3$s is the arrow icon. */
								__(
									"Let AI do some of the thinking for you and help you save time. Get high-quality suggestions for titles and meta descriptions to make your content rank high and look good on social media. %1$sLearn more%2$s%3$s",
									"wordpress-seo"
								),
								"<a>",
								"<ArrowNarrowRightIcon />",
								"</a>"
							),
							learnMoreLinkStructure
						)
					}
				</div>
			</div>
			{ isUsageCountLimitReached && <Alert className="yst-my-4">
				{ sprintf(
					/* translators: %s is for Yoast SEO Premium. */
					__( "Oh no! Its seems like you're out of free Sparks. Keep the momentum going, unlock unlimited sparks with %s!", "wordpress-seo" ),
					"Yoast SEO Premium"
				) }
			</Alert> }
			<div
				className={ classNames(
					"yst-w-full yst-flex yst-flex-col",
					isUsageCountLimitReached ? "yst-mt-0" : "yst-mt-6"
				) }
			>
				<Button
					as="a"
					className="yst-grow"
					size="extra-large"
					variant="upsell"
					href={ upsellLink }
					target="_blank"
					ref={ initialFocus }
					data-action="load-nfd-ctb"
					data-ctb-id={ ctbId }
				>
					<LockOpenIcon className="yst--ms-1 yst-me-2 yst-h-5 yst-w-5" />
					{ upsellLabel }
					<span className="yst-sr-only">
						{
							/* translators: Hidden accessibility text. */
							__( "(Opens in a new browser tab)", "wordpress-seo" )
						}
					</span>
				</Button>
				{ ! isUsageCountLimitReached && <GradientButton onClick={ handleStartTrial } className="yst-mt-2 yst-w-full yst-text-base yst-text-slate-800 yst-font-medium yst-h-11 hover:yst-bg-gradient-to-l hover:yst-from-indigo-100 hover:yst-to-primary-100">
					{ __( "Try for free", "wordpress-seo" ) }
				</GradientButton> }
			</div>
			<Button
				as="a"
				className="yst-mt-4"
				variant="tertiary"
				onClick={ onClose }
			>
				{ __( "Close", "wordpress-seo" ) }
			</Button>
		</div>
	</>;
};
