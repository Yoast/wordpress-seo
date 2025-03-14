import { ArrowSmRightIcon } from "@heroicons/react/solid";
import { __ } from "@wordpress/i18n";
import { Button, Modal, useSvgAria } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { ReactComponent as YoastConnectSiteKit } from "../../../images/yoast-connect-google-site-kit.svg";
import { OutboundLink } from "./outbound-link";

/**
 * The Site Kit consent modal component.
 *
 * @param {boolean} isOpen Whether the modal is open.
 * @param {function} onClose Callback to close the modal.
 * @param {function} onGrantConsent Callback to grant consent.
 * @param {string} [learnMoreLink] The learn more link.
 *
 * @returns {JSX.Element} The Site Kit consent modal component.
 */
export const SiteKitConsentModal = ( {
	isOpen,
	onClose,
	onGrantConsent,
	learnMoreLink = "",
} ) => {
	const svgAriaProps = useSvgAria();

	return (
		<Modal
			isOpen={ isOpen }
			onClose={ onClose }
		>
			<Modal.Panel className="yst-max-w-lg yst-p-0 yst-rounded-3xl" hasCloseButton={ false }>
				<Modal.CloseButton
					className="yst-bg-transparent yst-text-gray-500 focus:yst-ring-offset-0"
					onClick={ onClose }
					screenReaderText={ __( "Close", "wordpress-seo" ) }
				/>
				<div className="yst-px-10 yst-pt-10 yst-bg-gradient-to-b yst-from-primary-500/25 yst-to-[80%]">
					<YoastConnectSiteKit width="432" height="243" className="yst-p-7 yst-bg-white yst-rounded-md yst-drop-shadow-md" />
				</div>
				<div className="yst-px-10 yst-pb-4 yst-flex yst-flex-col yst-items-center">
					<div className="yst-mt-4 yst-mx-1.5 yst-text-center">
						<h3 className="yst-text-slate-900 yst-text-lg yst-font-medium">
							{ __( "Grant consent to connect with Site Kit by Google", "wordpress-seo" ) }
						</h3>
						<div className="yst-mt-2 yst-text-slate-600 yst-text-sm">
							{ __( "Give us permission to access your Site Kit data, allowing insights from tools like Google Analytics and Search Console to be displayed directly on your dashboard.", "wordpress-seo" ) }
							{ " " }
							<OutboundLink
								className="yst-no-underline yst-font-medium"
								variant="primary"
								href={ learnMoreLink }
							>
								{ __( "Learn more", "wordpress-seo" ) }
								<ArrowSmRightIcon
									className="yst-inline yst-h-4 yst-w-4 yst-ms-1 rtl:yst-rotate-180"
									{ ...svgAriaProps }
								/>
							</OutboundLink>
						</div>
					</div>
					<div className="yst-w-full yst-flex yst-mt-10">
						<Button className="yst-grow" size="extra-large" variant="primary" onClick={ onGrantConsent || onClose }>
							{ __( "Grant consent", "wordpress-seo" ) }
						</Button>
					</div>
					<Button as="a" className="yst-mt-4" variant="tertiary" onClick={ onClose }>
						{ __( "Close", "wordpress-seo" ) }
					</Button>
				</div>
			</Modal.Panel>
		</Modal>
	);
};

SiteKitConsentModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onGrantConsent: PropTypes.func,
	learnMoreLink: PropTypes.string,
};
