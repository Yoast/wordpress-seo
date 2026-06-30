import LockClosedIcon from "@heroicons/react/outline/LockClosedIcon";
import { useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, GradientSparklesIcon, Modal, useSvgAria } from "@yoast/ui-library";
import { OutboundLink } from "../../shared-admin/components";

/**
 * The upsell modal shown when a Free user triggers a bulk AI generate action.
 *
 * @param {Object}   props                 The props.
 * @param {boolean}  props.isOpen          Whether the modal is open.
 * @param {Function} props.onClose         Closes the modal.
 * @param {string}   props.upsellLabel     The CTA label (Premium or WooCommerce SEO).
 * @param {string}   props.upsellLink      The CTA URL.
 * @param {string}   [props.ctbId]         The click-to-buy id.
 * @param {string}   [props.learnMoreLink] The "Learn more" link URL.
 *
 * @returns {JSX.Element} The upsell modal.
 */
export const UpsellModal = ( { isOpen, onClose, upsellLabel, upsellLink, ctbId, learnMoreLink } ) => {
	const upsellRef = useRef( null );
	const svgAriaProps = useSvgAria();
	const ctbProps = ctbId ? { "data-action": "load-nfd-ctb", "data-ctb-id": ctbId } : {};

	return (
		<Modal isOpen={ isOpen } onClose={ onClose } initialFocus={ upsellRef }>
			<Modal.Panel className="yst-max-w-sm yst-p-6" closeButtonScreenReaderText={ __( "Close", "wordpress-seo" ) }>
				<div className="yst-flex yst-flex-col yst-items-center yst-gap-6 yst-text-center">
					<div className="yst-flex yst-flex-col yst-items-center yst-gap-4">
						<span className="yst-flex yst-h-12 yst-w-12 yst-items-center yst-justify-center yst-rounded-full yst-bg-ai-100">
							<GradientSparklesIcon className="yst-h-6 yst-w-6" { ...svgAriaProps } />
						</span>
						<div className="yst-flex yst-flex-col yst-items-center yst-gap-2">
							<Modal.Title as="h3" className="yst-text-lg yst-font-medium yst-text-slate-900">
								{ __( "Generate Metadata in Bulk", "wordpress-seo" ) }
							</Modal.Title>
							<Modal.Description as="p" className="yst-text-sm yst-text-slate-600">
								{ __( "Instantly create SEO titles, meta descriptions, and social metadata for all your content. Upgrade to unlock bulk AI generation and streamline your workflow.", "wordpress-seo" ) }
							</Modal.Description>
						</div>
					</div>
					<Button
						as="a"
						ref={ upsellRef }
						variant="upsell"
						href={ upsellLink }
						target="_blank"
						rel="noopener noreferrer"
						className="yst-w-full"
						{ ...ctbProps }
					>
						<LockClosedIcon className="yst--ms-1 yst-me-2 yst-h-5 yst-w-5" aria-hidden="true" />
						{ upsellLabel }
						<span className="yst-sr-only">{ __( "(Opens in a new browser tab)", "wordpress-seo" ) }</span>
					</Button>
					{ learnMoreLink && (
						<OutboundLink href={ learnMoreLink } variant="primary" className="yst-text-sm yst-font-medium yst-no-underline">
							{ __( "Learn more", "wordpress-seo" ) }
						</OutboundLink>
					) }
				</div>
			</Modal.Panel>
		</Modal>
	);
};
