import { Modal } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { PropTypes } from "prop-types";

/**
 * The Site Kit consent modal component.
 *
 * @param {boolean} isOpen Whether the modal is open.
 * @param {Function} onClose Callback to close the modal.
 *
 * @returns {JSX.Element} The Site Kit consent modal component.
 */
export const SiteKitConsentModal = ( { isOpen, onClose } ) => {
	return (
		<Modal
			isOpen={ isOpen }
			onClose={ onClose }
		>
			<Modal.Panel>
				<Modal.Title>{ __( "Connect Site Kit by Google", "wordpress-seo" ) }</Modal.Title>
				<Modal.Description>
					{ __( "Connect your Google account to view traffic and search rankings on your dashboard.", "wordpress-seo" ) }
				</Modal.Description>
			</Modal.Panel>
		</Modal>
	);
};

SiteKitConsentModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
};
