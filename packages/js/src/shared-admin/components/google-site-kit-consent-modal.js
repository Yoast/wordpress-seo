import { Modal } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { PropTypes } from "prop-types";

/**
 * The Site Kit consent modal component.
 * 
 * @param isOpen {boolean} Whether the modal is open.
 * @param onClose {Function} Callback to close the modal.
 * 
 * @returns {WPElement} The Site Kit consent modal component.
 */
export const GoogleSiteKitConsentModal = ( { isOpen, onClose } ) => {
	return (
		<Modal
			isOpen={ isOpen }
			onClose={ onClose }
		>
			<Modal.Panel>
				<Modal.Title>{ __( "Connect Site Kit by Google", "wordpress-seo" ) }</Modal.Title>
				<Modal.Description>
					<p>{ __( "Connect your Google account to view traffic and search rankings on your dashboard.", "wordpress-seo" ) }</p>
				</Modal.Description>
			</Modal.Panel>
		</Modal>
	);
}

GoogleSiteKitConsentModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
};
